import { test, expect } from '@playwright/test';

test.describe('Color Palette Analysis', () => {
  test('should display correct orange accent color (#FF6B35)', async ({ page }) => {
    await page.goto('/');
    
    // Check if primary buttons use the orange accent color
    const primaryButton = page.locator('button[class*="bg-primary"]').first();
    if (await primaryButton.count() > 0) {
      const backgroundColor = await primaryButton.evaluate((el) => 
        window.getComputedStyle(el).backgroundColor
      );
      expect(backgroundColor).toBe('rgb(255, 107, 53)'); // #FF6B35 in RGB
    }
  });

  test('should display correct green success color (#1DCC5C)', async ({ page }) => {
    await page.goto('/');
    
    // Check if success elements use the green color
    const successElement = page.locator('[class*="bg-success"]').first();
    if (await successElement.count() > 0) {
      const backgroundColor = await successElement.evaluate((el) => 
        window.getComputedStyle(el).backgroundColor
      );
      expect(backgroundColor).toBe('rgb(29, 204, 92)'); // #1DCC5C in RGB
    }
  });

  test('should have correct dark theme background colors', async ({ page }) => {
    await page.goto('/');
    
    // Enable dark theme
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    
    // Check main background color
    const body = page.locator('body');
    const backgroundColor = await body.evaluate((el) => 
      window.getComputedStyle(el).backgroundColor
    );
    expect(backgroundColor).toBe('rgb(26, 26, 26)'); // #1A1A1A in RGB
    
    // Check card background color
    const card = page.locator('[class*="bg-card"]').first();
    if (await card.count() > 0) {
      const cardBackgroundColor = await card.evaluate((el) => 
        window.getComputedStyle(el).backgroundColor
      );
      expect(cardBackgroundColor).toBe('rgb(42, 42, 42)'); // #2A2A2A in RGB
    }
  });

  test('should maintain color consistency across components', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Take screenshot for visual regression testing
    await expect(page).toHaveScreenshot('color-palette-consistency.png');
  });

  test('should have proper color contrast ratios', async ({ page }) => {
    await page.goto('/');
    
    // Test primary button contrast
    const primaryButton = page.locator('button[class*="bg-primary"]').first();
    if (await primaryButton.count() > 0) {
      const color = await primaryButton.evaluate((el) => 
        window.getComputedStyle(el).color
      );
      const backgroundColor = await primaryButton.evaluate((el) => 
        window.getComputedStyle(el).backgroundColor
      );
      
      // Basic contrast check - white text on orange background should be visible
      expect(color).toBe('rgb(255, 255, 255)'); // White text
      expect(backgroundColor).toBe('rgb(255, 107, 53)'); // Orange background
    }
  });
});
