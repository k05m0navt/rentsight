import { test, expect } from '@playwright/test';

test.describe('Spacing Analysis', () => {
  test('should use 8-point spacing scale', async ({ page }) => {
    await page.goto('/');
    
    // Check if spacing follows 8-point scale (4px, 8px, 16px, 24px, 32px, etc.)
    const container = page.locator('[class*="p-"], [class*="m-"], [class*="gap-"]').first();
    if (await container.count() > 0) {
      const padding = await container.evaluate((el) => 
        window.getComputedStyle(el).padding
      );
      const margin = await container.evaluate((el) => 
        window.getComputedStyle(el).margin
      );
      
      // Check if values are multiples of 4px (8-point scale)
      const paddingValues = padding.split(' ').map(val => parseInt(val));
      const marginValues = margin.split(' ').map(val => parseInt(val));
      
      [...paddingValues, ...marginValues].forEach(value => {
        if (!isNaN(value)) {
          expect(value % 4).toBe(0); // Should be multiple of 4px
        }
      });
    }
  });

  test('should have consistent card spacing', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check card padding
    const card = page.locator('[class*="bg-card"]').first();
    if (await card.count() > 0) {
      const padding = await card.evaluate((el) => 
        window.getComputedStyle(el).padding
      );
      
      // Should have consistent padding (typically 16px or 24px)
      const paddingValues = padding.split(' ').map(val => parseInt(val));
      paddingValues.forEach(value => {
        if (!isNaN(value)) {
          expect([16, 24, 32]).toContain(value); // Common card padding values
        }
      });
    }
  });

  test('should have proper component spacing', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Take screenshot for visual regression testing
    await expect(page).toHaveScreenshot('spacing-consistency.png');
  });

  test('should maintain spacing in responsive layouts', async ({ page }) => {
    // Test mobile spacing
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Take screenshot for mobile spacing
    await expect(page).toHaveScreenshot('spacing-mobile.png');
    
    // Test tablet spacing
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    // Take screenshot for tablet spacing
    await expect(page).toHaveScreenshot('spacing-tablet.png');
    
    // Test desktop spacing
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    
    // Take screenshot for desktop spacing
    await expect(page).toHaveScreenshot('spacing-desktop.png');
  });

  test('should have consistent grid spacing', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check grid gap if using CSS Grid
    const grid = page.locator('[class*="grid"]').first();
    if (await grid.count() > 0) {
      const gap = await grid.evaluate((el) => 
        window.getComputedStyle(el).gap
      );
      
      if (gap && gap !== 'normal') {
        const gapValue = parseInt(gap);
        expect([16, 24, 32]).toContain(gapValue); // Common grid gap values
      }
    }
  });

  test('should maintain spacing consistency in dark theme', async ({ page }) => {
    await page.goto('/');
    
    // Enable dark theme
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    
    // Take screenshot for dark theme spacing
    await expect(page).toHaveScreenshot('spacing-dark-theme.png');
  });
});
