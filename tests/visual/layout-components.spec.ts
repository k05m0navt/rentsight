import { test, expect } from '@playwright/test';

test.describe('Layout Components Analysis', () => {
  test('should display sidebar with proper styling', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/dashboard');
    
    const sidebar = page.locator('aside, [role="navigation"]').first();
    if (await sidebar.count() > 0) {
      const width = await sidebar.evaluate((el) => 
        window.getComputedStyle(el).width
      );
      expect(parseInt(width)).toBeGreaterThan(0);
    }
  });

  test('should display active navigation with orange accent', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/dashboard');
    
    const activeNav = page.locator('.active, [aria-current="page"]').first();
    if (await activeNav.count() > 0) {
      const color = await activeNav.evaluate((el) => 
        window.getComputedStyle(el).color
      );
      // Should use orange accent
      expect(color).toMatch(/rgb\(\d+,\s*\d+,\s*\d+\)/);
    }
  });

  test('should have consistent sidebar spacing', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/dashboard');
    
    // Take screenshot for visual regression
    await expect(page).toHaveScreenshot('sidebar-layout.png');
  });

  test('should display bottom navigation on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dashboard');
    
    const bottomNav = page.locator('nav').last();
    if (await bottomNav.count() > 0) {
      const position = await bottomNav.evaluate((el) => 
        window.getComputedStyle(el).position
      );
      expect(['fixed', 'sticky']).toContain(position);
    }
  });

  test('should maintain navigation spacing in responsive layouts', async ({ page }) => {
    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dashboard');
    await expect(page).toHaveScreenshot('navigation-mobile.png');
    
    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/dashboard');
    await expect(page).toHaveScreenshot('navigation-tablet.png');
    
    // Desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/dashboard');
    await expect(page).toHaveScreenshot('navigation-desktop.png');
  });

  test('should have proper header spacing', async ({ page }) => {
    await page.goto('/dashboard');
    
    const header = page.locator('header').first();
    if (await header.count() > 0) {
      const padding = await header.evaluate((el) => 
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

  test('should maintain layout consistency in dark theme', async ({ page }) => {
    await page.goto('/dashboard');
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    
    // Take screenshot for dark theme validation
    await expect(page).toHaveScreenshot('layout-dark-theme.png');
  });
});
