import { test, expect } from '@playwright/test';

test.describe('Dashboard Layout Analysis', () => {
  test('should display dashboard with proper grid layout', async ({ page }) => {
    await page.goto('/dashboard');
    
    const grid = page.locator('[class*="grid"]').first();
    if (await grid.count() > 0) {
      const display = await grid.evaluate((el) => 
        window.getComputedStyle(el).display
      );
      expect(['grid', 'flex']).toContain(display);
    }
  });

  test('should have consistent grid spacing', async ({ page }) => {
    await page.goto('/dashboard');
    
    const grid = page.locator('[class*="grid"]').first();
    if (await grid.count() > 0) {
      const gap = await grid.evaluate((el) => 
        window.getComputedStyle(el).gap
      );
      
      if (gap && gap !== 'normal') {
        const gapValue = parseInt(gap);
        expect([16, 24, 32]).toContain(gapValue);
      }
    }
  });

  test('should display metrics cards in proper layout', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Take screenshot for visual regression
    await expect(page).toHaveScreenshot('dashboard-metrics-layout.png');
  });

  test('should maintain responsive grid layout', async ({ page }) => {
    // Mobile - should stack vertically
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dashboard');
    await expect(page).toHaveScreenshot('dashboard-layout-mobile.png');
    
    // Tablet - should show 2 columns
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/dashboard');
    await expect(page).toHaveScreenshot('dashboard-layout-tablet.png');
    
    // Desktop - should show full grid
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/dashboard');
    await expect(page).toHaveScreenshot('dashboard-layout-desktop.png');
  });

  test('should have proper content padding', async ({ page }) => {
    await page.goto('/dashboard');
    
    const main = page.locator('main').first();
    if (await main.count() > 0) {
      const padding = await main.evaluate((el) => 
        window.getComputedStyle(el).padding
      );
      
      const paddingValues = padding.split(' ').map(val => parseInt(val));
      paddingValues.forEach(value => {
        if (!isNaN(value)) {
          expect(value % 4).toBe(0); // 8-point scale
        }
      });
    }
  });

  test('should display charts with proper spacing', async ({ page }) => {
    await page.goto('/dashboard/rent-analytics');
    
    // Take screenshot for chart layout validation
    await expect(page).toHaveScreenshot('dashboard-charts-layout.png');
  });

  test('should maintain visual hierarchy', async ({ page }) => {
    await page.goto('/dashboard');
    
    const heading = page.locator('h1, h2').first();
    if (await heading.count() > 0) {
      const fontSize = await heading.evaluate((el) => 
        window.getComputedStyle(el).fontSize
      );
      const fontWeight = await heading.evaluate((el) => 
        window.getComputedStyle(el).fontWeight
      );
      
      expect(['700', 'bold']).toContain(fontWeight);
      expect(parseInt(fontSize)).toBeGreaterThan(16);
    }
  });

  test('should have consistent section spacing', async ({ page }) => {
    await page.goto('/dashboard');
    
    const sections = page.locator('section');
    if (await sections.count() > 0) {
      // Take screenshot for section spacing validation
      await expect(page).toHaveScreenshot('dashboard-sections.png');
    }
  });
});
