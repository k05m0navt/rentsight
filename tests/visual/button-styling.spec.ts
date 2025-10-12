import { test, expect } from '@playwright/test';

test.describe('Button Component Styling', () => {
  test('should display primary button with orange accent color', async ({ page }) => {
    await page.goto('/');
    
    const primaryButton = page.locator('button[class*="bg-primary"]').first();
    if (await primaryButton.count() > 0) {
      const backgroundColor = await primaryButton.evaluate((el) => 
        window.getComputedStyle(el).backgroundColor
      );
      expect(backgroundColor).toBe('rgb(255, 107, 53)'); // #FF6B35
    }
  });

  test('should display success button with green color', async ({ page }) => {
    await page.goto('/');
    
    const successButton = page.locator('button[class*="bg-success"]').first();
    if (await successButton.count() > 0) {
      const backgroundColor = await successButton.evaluate((el) => 
        window.getComputedStyle(el).backgroundColor
      );
      expect(backgroundColor).toBe('rgb(29, 204, 92)'); // #1DCC5C
    }
  });

  test('should have proper button hover states', async ({ page }) => {
    await page.goto('/');
    
    const primaryButton = page.locator('button[class*="bg-primary"]').first();
    if (await primaryButton.count() > 0) {
      await primaryButton.hover();
      await page.waitForTimeout(300); // Wait for transition
      
      // Take screenshot to validate hover state
      await expect(page).toHaveScreenshot('button-hover-state.png');
    }
  });

  test('should have proper button focus states', async ({ page }) => {
    await page.goto('/');
    
    const primaryButton = page.locator('button[class*="bg-primary"]').first();
    if (await primaryButton.count() > 0) {
      await primaryButton.focus();
      
      const outline = await primaryButton.evaluate((el) => 
        window.getComputedStyle(el).outline
      );
      // Should have focus outline or box-shadow
      expect(outline).not.toBe('none');
    }
  });

  test('should display disabled buttons with proper styling', async ({ page }) => {
    await page.goto('/');
    
    const disabledButton = page.locator('button:disabled').first();
    if (await disabledButton.count() > 0) {
      const opacity = await disabledButton.evaluate((el) => 
        window.getComputedStyle(el).opacity
      );
      expect(parseFloat(opacity)).toBeLessThan(1);
    }
  });

  test('should have consistent button padding', async ({ page }) => {
    await page.goto('/');
    
    const button = page.locator('button').first();
    if (await button.count() > 0) {
      const padding = await button.evaluate((el) => 
        window.getComputedStyle(el).padding
      );
      
      const paddingValues = padding.split(' ').map(val => parseInt(val));
      paddingValues.forEach(value => {
        if (!isNaN(value)) {
          expect(value % 4).toBe(0); // Should follow 8-point scale
        }
      });
    }
  });

  test('should have proper button border radius', async ({ page }) => {
    await page.goto('/');
    
    const button = page.locator('button').first();
    if (await button.count() > 0) {
      const borderRadius = await button.evaluate((el) => 
        window.getComputedStyle(el).borderRadius
      );
      expect(['4px', '8px', '12px', '9999px']).toContain(borderRadius);
    }
  });

  test('should maintain button styling in dark theme', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    
    const primaryButton = page.locator('button[class*="bg-primary"]').first();
    if (await primaryButton.count() > 0) {
      const backgroundColor = await primaryButton.evaluate((el) => 
        window.getComputedStyle(el).backgroundColor
      );
      expect(backgroundColor).toBe('rgb(255, 107, 53)'); // #FF6B35
    }
    
    // Take screenshot for visual regression
    await expect(page).toHaveScreenshot('button-styling-dark.png');
  });

  test('should display button variants correctly', async ({ page }) => {
    await page.goto('/');
    
    // Take screenshot of all button variants
    await expect(page).toHaveScreenshot('button-variants.png');
  });

  test('should have proper button text color', async ({ page }) => {
    await page.goto('/');
    
    const primaryButton = page.locator('button[class*="bg-primary"]').first();
    if (await primaryButton.count() > 0) {
      const color = await primaryButton.evaluate((el) => 
        window.getComputedStyle(el).color
      );
      expect(color).toBe('rgb(255, 255, 255)'); // White text
    }
  });
});
