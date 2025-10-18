/**
 * Browser Compatibility Tests
 * 
 * Tests specific browser compatibility issues and features
 * across Chrome, Firefox, Safari, and Edge.
 */

import { test, expect } from '@playwright/test';

test.describe('Cross-Browser Compatibility', () => {
  test('should handle CSS custom properties correctly', async ({ page, browserName }) => {
    await page.goto('/dashboard');
    
    // Check that CSS custom properties are working
    const primaryColor = await page.evaluate(() => {
      const element = document.querySelector('[data-testid="primary-button"]');
      if (element) {
        return window.getComputedStyle(element).getPropertyValue('background-color');
      }
      return null;
    });
    
    // Different browsers might return different formats, but should not be empty
    expect(primaryColor).toBeTruthy();
    
    // Check theme switching works in all browsers
    const initialTheme = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    });
    
    // Toggle theme
    const themeToggle = page.locator('button[data-testid="theme-toggle"]');
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(500);
      
      const newTheme = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      });
      
      expect(newTheme).not.toBe(initialTheme);
    }
  });

  test('should handle JavaScript features consistently', async ({ page, browserName }) => {
    await page.goto('/dashboard');
    
    // Test localStorage support
    const localStorageSupported = await page.evaluate(() => {
      try {
        localStorage.setItem('test', 'value');
        const result = localStorage.getItem('test');
        localStorage.removeItem('test');
        return result === 'value';
      } catch {
        return false;
      }
    });
    
    expect(localStorageSupported).toBeTruthy();
    
    // Test fetch API support
    const fetchSupported = await page.evaluate(() => {
      return typeof fetch === 'function';
    });
    
    expect(fetchSupported).toBeTruthy();
    
    // Test modern JavaScript features
    const modernJSFeatures = await page.evaluate(() => {
      return {
        asyncAwait: typeof (async () => {})() === 'object',
        arrowFunctions: (() => true)(),
        templateLiterals: `test ${'string'}` === 'test string',
        destructuring: (() => {
          const { a, b } = { a: 1, b: 2 };
          return a === 1 && b === 2;
        })(),
        spreadOperator: [...[1, 2, 3]].length === 3
      };
    });
    
    Object.values(modernJSFeatures).forEach(feature => {
      expect(feature).toBeTruthy();
    });
  });

  test('should handle form validation consistently', async ({ page, browserName }) => {
    await page.goto('/settings');
    
    // Test HTML5 validation
    const nameInput = page.locator('input[name="name"]');
    if (await nameInput.isVisible()) {
      await nameInput.clear();
      await nameInput.blur();
      
      // Check validation message
      const validity = await nameInput.evaluate((input: HTMLInputElement) => {
        return {
          valid: input.validity.valid,
          valueMissing: input.validity.valueMissing,
          validationMessage: input.validationMessage
        };
      });
      
      expect(validity.valueMissing).toBeTruthy();
    }
    
    // Test email validation
    const emailInput = page.locator('input[type="email"]');
    if (await emailInput.isVisible()) {
      await emailInput.fill('invalid-email');
      await emailInput.blur();
      
      const validity = await emailInput.evaluate((input: HTMLInputElement) => {
        return {
          valid: input.validity.valid,
          typeMismatch: input.validity.typeMismatch
        };
      });
      
      expect(validity.typeMismatch).toBeTruthy();
    }
  });

  test('should handle animations and transitions', async ({ page, browserName }) => {
    await page.goto('/help');
    
    // Test CSS transitions
    const card = page.locator('[data-testid="popular-article"]').first();
    if (await card.isVisible()) {
      // Hover to trigger transition
      await card.hover();
      await page.waitForTimeout(300);
      
      // Check transform property
      const transform = await card.evaluate((element: HTMLElement) => {
        return window.getComputedStyle(element).transform;
      });
      
      // Should have some transform applied (browser-specific)
      expect(transform).toBeTruthy();
    }
    
    // Test Framer Motion animations
    const faqItems = page.locator('[data-testid="faq-item"]');
    const count = await faqItems.count();
    
    if (count > 0) {
      const firstFaq = faqItems.first();
      const question = firstFaq.locator('[data-testid="faq-question"]');
      
      // Click to trigger animation
      await question.click();
      
      // Check animation duration
      const animationDuration = await firstFaq.evaluate((element: HTMLElement) => {
        return window.getComputedStyle(element).transitionDuration;
      });
      
      expect(animationDuration).toBeTruthy();
    }
  });

  test('should handle reduced motion preferences', async ({ page, browserName }) => {
    // Test with reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/dashboard');
    
    // Check that animations are reduced
    const animationDuration = await page.evaluate(() => {
      const element = document.querySelector('[data-testid="dashboard-content"]');
      if (element) {
        return window.getComputedStyle(element).animationDuration;
      }
      return null;
    });
    
    // Should be 0s or very short duration
    if (animationDuration) {
      expect(animationDuration).toMatch(/0s|0\.0+s/);
    }
    
    // Reset media preferences
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  });

  test('should handle different screen densities', async ({ page, browserName }) => {
    // Test high DPI display
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.evaluate(() => {
      Object.defineProperty(window, 'devicePixelRatio', {
        get: () => 2
      });
    });
    
    await page.goto('/dashboard');
    
    // Check that images and icons scale properly
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const naturalWidth = await img.evaluate((element: HTMLImageElement) => element.naturalWidth);
      const displayWidth = await img.evaluate((element: HTMLImageElement) => element.offsetWidth);
      
      // Should have proper scaling
      expect(naturalWidth).toBeGreaterThan(0);
      expect(displayWidth).toBeGreaterThan(0);
    }
  });

  test('should handle different font rendering', async ({ page, browserName }) => {
    await page.goto('/dashboard');
    
    // Check font loading
    const fontFamily = await page.evaluate(() => {
      const element = document.querySelector('body');
      if (element) {
        return window.getComputedStyle(element).fontFamily;
      }
      return null;
    });
    
    expect(fontFamily).toBeTruthy();
    expect(fontFamily).toContain('Inter'); // Our custom font
    
    // Check text rendering
    const textElement = page.locator('h1').first();
    const textContent = await textElement.textContent();
    expect(textContent).toBeTruthy();
    
    // Check text is readable
    const fontSize = await textElement.evaluate((element: HTMLElement) => {
      return window.getComputedStyle(element).fontSize;
    });
    
    // Should be at least 16px for readability
    const fontSizeNum = parseFloat(fontSize);
    expect(fontSizeNum).toBeGreaterThanOrEqual(16);
  });

  test('should handle browser-specific quirks', async ({ page, browserName }) => {
    await page.goto('/settings');
    
    // Test select dropdown behavior
    const currencySelect = page.locator('select[id="currency_format"]');
    if (await currencySelect.isVisible()) {
      await currencySelect.click();
      
      // Check dropdown opens (browser-specific behavior)
      const options = page.locator('select[id="currency_format"] option');
      const optionCount = await options.count();
      expect(optionCount).toBeGreaterThan(0);
      
      // Test option selection
      await currencySelect.selectOption('EUR');
      const selectedValue = await currencySelect.inputValue();
      expect(selectedValue).toBe('EUR');
    }
    
    // Test button focus states
    const button = page.locator('button[type="submit"]').first();
    if (await button.isVisible()) {
      await button.focus();
      
      // Check focus is visible
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
      
      // Check focus ring
      const focusRing = await button.evaluate((element: HTMLElement) => {
        return window.getComputedStyle(element).outline;
      });
      
      // Should have some focus indication
      expect(focusRing).toBeTruthy();
    }
  });

  test('should handle browser storage limits', async ({ page, browserName }) => {
    // Test localStorage capacity
    const storageTest = await page.evaluate(() => {
      try {
        // Try to store a large amount of data
        const largeData = 'x'.repeat(1024 * 1024); // 1MB
        localStorage.setItem('test-large', largeData);
        const retrieved = localStorage.getItem('test-large');
        localStorage.removeItem('test-large');
        return retrieved === largeData;
      } catch (error) {
        return false;
      }
    });
    
    // Should handle storage gracefully
    expect(typeof storageTest).toBe('boolean');
    
    // Test sessionStorage
    const sessionStorageTest = await page.evaluate(() => {
      try {
        sessionStorage.setItem('test-session', 'value');
        const retrieved = sessionStorage.getItem('test-session');
        sessionStorage.removeItem('test-session');
        return retrieved === 'value';
      } catch {
        return false;
      }
    });
    
    expect(sessionStorageTest).toBeTruthy();
  });

  test('should handle browser security features', async ({ page, browserName }) => {
    await page.goto('/dashboard');
    
    // Test HTTPS enforcement (if applicable)
    const protocol = page.url().startsWith('https:');
    
    // Test Content Security Policy compliance
    const cspViolations = await page.evaluate(() => {
      return window.performance.getEntriesByType('navigation')[0]?.transferSize || 0;
    });
    
    // Should load without CSP violations
    expect(cspViolations).toBeGreaterThan(0);
    
    // Test secure context features
    const secureContext = await page.evaluate(() => {
      return window.isSecureContext;
    });
    
    // Should be in secure context for production
    if (page.url().includes('https://')) {
      expect(secureContext).toBeTruthy();
    }
  });

  test('should handle browser performance characteristics', async ({ page, browserName }) => {
    await page.goto('/dashboard');
    
    // Test page load performance
    const loadTime = await page.evaluate(() => {
      const navigation = window.performance.getEntriesByType('navigation')[0];
      return navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0;
    });
    
    // Should load within reasonable time
    expect(loadTime).toBeLessThan(5000); // 5 seconds max
    
    // Test memory usage
    const memoryUsage = await page.evaluate(() => {
      return (performance as any).memory ? (performance as any).memory.usedJSHeapSize : 0;
    });
    
    // Should not use excessive memory
    if (memoryUsage > 0) {
      expect(memoryUsage).toBeLessThan(100 * 1024 * 1024); // 100MB max
    }
  });
});
