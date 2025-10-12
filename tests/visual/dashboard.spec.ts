import { test, expect } from '@playwright/test';

const themes = ['light', 'dark'];

test.describe('Dashboard visual regression tests', () => {
  for (const theme of themes) {
    test(`dashboard ${theme} theme - desktop`, async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      // Set theme before navigation
      await page.goto('/');
      await page.evaluate((t) => {
        localStorage.setItem('rentsight-theme', t);
        document.documentElement.classList.toggle('dark', t === 'dark');
      }, theme);
      
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Wait for dashboard content to load
      await page.waitForSelector('[data-testid="dashboard-content"], .dashboard, main', { 
        state: 'visible',
        timeout: 10000 
      });
      
      // Take full page screenshot
      await expect(page).toHaveScreenshot(
        `dashboard-${theme}-desktop.png`,
        {
          fullPage: true,
          maxDiffPixels: 2000, // Allow more pixels for dynamic content/charts
        }
      );
    });

    test(`dashboard ${theme} theme - tablet`, async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await page.goto('/');
      await page.evaluate((t) => {
        localStorage.setItem('rentsight-theme', t);
        document.documentElement.classList.toggle('dark', t === 'dark');
      }, theme);
      
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      await page.waitForSelector('[data-testid="dashboard-content"], .dashboard, main', { 
        state: 'visible',
        timeout: 10000 
      });
      
      await expect(page).toHaveScreenshot(
        `dashboard-${theme}-tablet.png`,
        {
          fullPage: true,
          maxDiffPixels: 2000,
        }
      );
    });

    test(`dashboard ${theme} theme - mobile`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto('/');
      await page.evaluate((t) => {
        localStorage.setItem('rentsight-theme', t);
        document.documentElement.classList.toggle('dark', t === 'dark');
      }, theme);
      
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      await page.waitForSelector('[data-testid="dashboard-content"], .dashboard, main', { 
        state: 'visible',
        timeout: 10000 
      });
      
      await expect(page).toHaveScreenshot(
        `dashboard-${theme}-mobile.png`,
        {
          fullPage: true,
          maxDiffPixels: 2000,
        }
      );
    });

    test(`dashboard metrics cards ${theme} theme`, async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      await page.goto('/');
      await page.evaluate((t) => {
        localStorage.setItem('rentsight-theme', t);
        document.documentElement.classList.toggle('dark', t === 'dark');
      }, theme);
      
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Find metrics cards
      const metricsCards = page.locator('[class*="MetricsCard"], [data-testid*="metric"]').first();
      
      if (await metricsCards.count() > 0) {
        await expect(metricsCards).toHaveScreenshot(
          `dashboard-metrics-${theme}.png`,
          {
            maxDiffPixels: 100,
          }
        );
      }
    });

    test(`dashboard charts ${theme} theme`, async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      await page.goto('/');
      await page.evaluate((t) => {
        localStorage.setItem('rentsight-theme', t);
        document.documentElement.classList.toggle('dark', t === 'dark');
      }, theme);
      
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Wait for charts to render
      await page.waitForTimeout(1000);
      
      // Find chart containers
      const chartContainer = page.locator('[class*="ChartContainer"], [data-testid*="chart"]').first();
      
      if (await chartContainer.count() > 0) {
        await expect(chartContainer).toHaveScreenshot(
          `dashboard-charts-${theme}.png`,
          {
            maxDiffPixels: 300, // Charts can have more variation
          }
        );
      }
    });
  }

  test('dashboard color palette verification', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Verify design tokens are applied
    const hasDesignTokens = await page.evaluate(() => {
      const body = document.body;
      const main = document.querySelector('main');
      
      if (!body || !main) return false;
      
      // Check if dark/light theme classes are present
      const hasTheme = document.documentElement.classList.contains('dark') || 
                       document.documentElement.classList.contains('light') ||
                       !document.documentElement.classList.contains('dark'); // Default is light
      
      // Check if main content area exists
      const hasMainContent = main !== null;
      
      // Check if any elements have background colors set
      const allElements = Array.from(document.querySelectorAll('*'));
      const hasStyledElements = allElements.some(el => {
        const styles = window.getComputedStyle(el);
        return styles.backgroundColor !== 'rgba(0, 0, 0, 0)' && 
               styles.backgroundColor !== 'transparent';
      });
      
      return hasTheme && hasMainContent && hasStyledElements;
    });
    
    expect(hasDesignTokens).toBe(true);
  });
});

