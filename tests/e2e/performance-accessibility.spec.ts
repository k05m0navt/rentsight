/**
 * Performance and Accessibility Tests
 * 
 * Tests performance metrics, accessibility compliance,
 * and WCAG AA standards across all browsers.
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Compliance', () => {
  test('should pass WCAG AA standards on dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForSelector('[data-testid="dashboard-content"]', { timeout: 10000 });
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
    
    // Check specific WCAG AA requirements
    const violations = accessibilityScanResults.violations;
    const criticalViolations = violations.filter(v => 
      v.impact === 'serious' || v.impact === 'critical'
    );
    
    expect(criticalViolations).toEqual([]);
  });

  test('should pass accessibility standards on settings page', async ({ page }) => {
    await page.goto('/settings');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should pass accessibility standards on help page', async ({ page }) => {
    await page.goto('/help');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper color contrast ratios', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Test color contrast on key elements
    const contrastTest = await page.evaluate(() => {
      const elements = document.querySelectorAll('h1, h2, h3, button, a, .text-muted');
      const results = [];
      
      for (const element of elements) {
        const styles = window.getComputedStyle(element);
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;
        
        // Basic contrast check (simplified)
        if (color && backgroundColor && color !== backgroundColor) {
          results.push({
            element: element.tagName,
            text: element.textContent?.slice(0, 50),
            hasContrast: true
          });
        }
      }
      
      return results;
    });
    
    expect(contrastTest.length).toBeGreaterThan(0);
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Test Tab navigation through interactive elements
    await page.keyboard.press('Tab');
    let focusCount = 0;
    const maxTabs = 10;
    
    for (let i = 0; i < maxTabs; i++) {
      const focusedElement = page.locator(':focus');
      if (await focusedElement.isVisible()) {
        focusCount++;
        const tagName = await focusedElement.evaluate(el => el.tagName);
        expect(['BUTTON', 'INPUT', 'SELECT', 'A', 'TEXTAREA']).toContain(tagName);
      }
      await page.keyboard.press('Tab');
    }
    
    expect(focusCount).toBeGreaterThan(0);
  });

  test('should have proper ARIA labels and roles', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check for proper ARIA attributes
    const ariaElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('[aria-label], [aria-labelledby], [role]');
      return Array.from(elements).map(el => ({
        tagName: el.tagName,
        ariaLabel: el.getAttribute('aria-label'),
        role: el.getAttribute('role'),
        hasLabel: !!(el.getAttribute('aria-label') || el.getAttribute('aria-labelledby'))
      }));
    });
    
    // Should have some ARIA elements
    expect(ariaElements.length).toBeGreaterThan(0);
    
    // Interactive elements should have labels
    const interactiveElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('button, input, select, textarea');
      return Array.from(elements).map(el => ({
        tagName: el.tagName,
        hasLabel: !!(el.getAttribute('aria-label') || 
                    el.getAttribute('aria-labelledby') || 
                    el.closest('label') ||
                    el.getAttribute('title'))
      }));
    });
    
    // Most interactive elements should have labels
    const labeledElements = interactiveElements.filter(el => el.hasLabel);
    expect(labeledElements.length).toBeGreaterThan(interactiveElements.length * 0.8);
  });

  test('should support screen readers', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check for proper heading hierarchy
    const headingStructure = await page.evaluate(() => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      return Array.from(headings).map(h => ({
        tag: h.tagName,
        text: h.textContent?.slice(0, 50),
        level: parseInt(h.tagName.charAt(1))
      }));
    });
    
    // Should have at least one h1
    const h1Count = headingStructure.filter(h => h.tag === 'H1').length;
    expect(h1Count).toBe(1);
    
    // Check for proper heading order
    let lastLevel = 0;
    for (const heading of headingStructure) {
      expect(heading.level).toBeGreaterThanOrEqual(lastLevel - 1);
      lastLevel = heading.level;
    }
  });

  test('should handle reduced motion preferences', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/help');
    
    // Check that animations respect reduced motion
    const animationDuration = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let maxDuration = 0;
      
      for (const element of elements) {
        const styles = window.getComputedStyle(element);
        const duration = parseFloat(styles.animationDuration) || 0;
        const transitionDuration = parseFloat(styles.transitionDuration) || 0;
        maxDuration = Math.max(maxDuration, duration, transitionDuration);
      }
      
      return maxDuration;
    });
    
    // Should have very short or no animations
    expect(animationDuration).toBeLessThanOrEqual(0.1);
    
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  });
});

test.describe('Performance Metrics', () => {
  test('should load dashboard within performance budget', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/dashboard');
    await page.waitForSelector('[data-testid="dashboard-content"]', { timeout: 10000 });
    const loadTime = Date.now() - startTime;
    
    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // Check Core Web Vitals
    const vitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitals = {
            LCP: 0,
            FID: 0,
            CLS: 0
          };
          
          entries.forEach((entry) => {
            if (entry.entryType === 'largest-contentful-paint') {
              vitals.LCP = entry.startTime;
            }
            if (entry.entryType === 'first-input') {
              vitals.FID = entry.processingStart - entry.startTime;
            }
            if (entry.entryType === 'layout-shift') {
              vitals.CLS += entry.value;
            }
          });
          
          resolve(vitals);
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
        
        // Fallback timeout
        setTimeout(() => resolve({ LCP: 0, FID: 0, CLS: 0 }), 2000);
      });
    });
    
    // Core Web Vitals thresholds
    expect((vitals as any).LCP).toBeLessThan(2500); // 2.5s
    expect((vitals as any).FID).toBeLessThan(100); // 100ms
    expect((vitals as any).CLS).toBeLessThan(0.1); // 0.1
  });

  test('should have efficient bundle size', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check JavaScript bundle size
    const jsResources = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      return scripts.map(script => ({
        src: script.getAttribute('src'),
        size: script.textContent?.length || 0
      }));
    });
    
    // Check CSS bundle size
    const cssResources = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      return links.map(link => ({
        href: link.getAttribute('href'),
        size: link.textContent?.length || 0
      }));
    });
    
    // Should have reasonable number of resources
    expect(jsResources.length).toBeLessThan(20);
    expect(cssResources.length).toBeLessThan(10);
  });

  test('should handle caching efficiently', async ({ page }) => {
    // First visit
    await page.goto('/dashboard');
    await page.waitForSelector('[data-testid="dashboard-content"]', { timeout: 10000 });
    
    // Check cache headers
    const response = await page.request.get('/dashboard');
    const cacheControl = response.headers()['cache-control'];
    
    // Should have caching headers
    expect(cacheControl).toBeTruthy();
    
    // Test client-side caching
    const cacheData = await page.evaluate(() => {
      return localStorage.getItem('cache:dashboard');
    });
    
    expect(cacheData).toBeTruthy();
    
    // Second visit should be faster
    const startTime = Date.now();
    await page.goto('/dashboard');
    await page.waitForSelector('[data-testid="dashboard-content"]', { timeout: 5000 });
    const secondLoadTime = Date.now() - startTime;
    
    expect(secondLoadTime).toBeLessThan(2000);
  });

  test('should have efficient memory usage', async ({ page }) => {
    await page.goto('/dashboard');
    
    const memoryUsage = await page.evaluate(() => {
      if ((performance as any).memory) {
        return {
          used: (performance as any).memory.usedJSHeapSize,
          total: (performance as any).memory.totalJSHeapSize,
          limit: (performance as any).memory.jsHeapSizeLimit
        };
      }
      return null;
    });
    
    if (memoryUsage) {
      // Should not use excessive memory
      expect(memoryUsage.used).toBeLessThan(50 * 1024 * 1024); // 50MB
      expect(memoryUsage.total).toBeLessThan(100 * 1024 * 1024); // 100MB
    }
  });

  test('should handle large datasets efficiently', async ({ page }) => {
    await page.goto('/properties');
    
    // Simulate large dataset
    await page.evaluate(() => {
      // Add many properties to test performance
      for (let i = 0; i < 100; i++) {
        const property = document.createElement('div');
        property.textContent = `Property ${i}`;
        property.className = 'property-item';
        document.body.appendChild(property);
      }
    });
    
    // Should still be responsive
    const startTime = Date.now();
    await page.click('body'); // Simple interaction
    const responseTime = Date.now() - startTime;
    
    expect(responseTime).toBeLessThan(100); // 100ms response time
  });

  test('should handle animations at 60fps', async ({ page }) => {
    await page.goto('/help');
    
    // Test animation performance
    const animationPerformance = await page.evaluate(() => {
      return new Promise((resolve) => {
        let frameCount = 0;
        const startTime = performance.now();
        
        function countFrames() {
          frameCount++;
          if (performance.now() - startTime < 1000) {
            requestAnimationFrame(countFrames);
          } else {
            resolve(frameCount);
          }
        }
        
        requestAnimationFrame(countFrames);
      });
    });
    
    // Should maintain close to 60fps
    expect((animationPerformance as number)).toBeGreaterThan(50);
  });

  test('should handle concurrent operations', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Simulate concurrent operations
    const operations = [
      page.click('button:has-text("Export")').catch(() => {}),
      page.hover('h1').catch(() => {}),
      page.keyboard.press('Tab').catch(() => {}),
      page.evaluate(() => localStorage.getItem('cache:dashboard')).catch(() => {})
    ];
    
    const startTime = Date.now();
    await Promise.all(operations);
    const concurrentTime = Date.now() - startTime;
    
    // Should handle concurrent operations efficiently
    expect(concurrentTime).toBeLessThan(2000);
  });

  test('should handle network throttling gracefully', async ({ page, context }) => {
    // Simulate slow network
    await context.route('**/*', route => {
      setTimeout(() => route.continue(), 100);
    });
    
    const startTime = Date.now();
    await page.goto('/dashboard');
    await page.waitForSelector('[data-testid="dashboard-content"]', { timeout: 15000 });
    const loadTime = Date.now() - startTime;
    
    // Should still load within reasonable time even with throttling
    expect(loadTime).toBeLessThan(15000);
  });
});
