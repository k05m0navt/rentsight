import { test, expect } from '@playwright/test';

test.describe('Typography Analysis', () => {
  test('should use Inter font family', async ({ page }) => {
    await page.goto('/');
    
    const body = page.locator('body');
    const fontFamily = await body.evaluate((el) => 
      window.getComputedStyle(el).fontFamily
    );
    expect(fontFamily).toContain('Inter');
  });

  test('should have correct font sizes and line heights', async ({ page }) => {
    await page.goto('/');
    
    // Check base font size
    const body = page.locator('body');
    const fontSize = await body.evaluate((el) => 
      window.getComputedStyle(el).fontSize
    );
    const lineHeight = await body.evaluate((el) => 
      window.getComputedStyle(el).lineHeight
    );
    
    expect(fontSize).toBe('16px'); // Base font size
    expect(lineHeight).toBe('24px'); // Base line height
  });

  test('should have proper font weights', async ({ page }) => {
    await page.goto('/');
    
    // Check heading font weights
    const heading = page.locator('h1, h2, h3').first();
    if (await heading.count() > 0) {
      const fontWeight = await heading.evaluate((el) => 
        window.getComputedStyle(el).fontWeight
      );
      expect(['700', 'bold']).toContain(fontWeight);
    }
    
    // Check body text font weight
    const body = page.locator('body');
    const bodyFontWeight = await body.evaluate((el) => 
      window.getComputedStyle(el).fontWeight
    );
    expect(bodyFontWeight).toBe('400');
  });

  test('should have consistent typography hierarchy', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Take screenshot for visual regression testing
    await expect(page).toHaveScreenshot('typography-hierarchy.png');
  });

  test('should maintain text readability in dark theme', async ({ page }) => {
    await page.goto('/');
    
    // Enable dark theme
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    
    // Check text color in dark theme
    const body = page.locator('body');
    const textColor = await body.evaluate((el) => 
      window.getComputedStyle(el).color
    );
    expect(textColor).toBe('rgb(238, 238, 238)'); // #EEEEEE in RGB
    
    // Take screenshot for visual regression testing
    await expect(page).toHaveScreenshot('typography-dark-theme.png');
  });

  test('should have proper text spacing and margins', async ({ page }) => {
    await page.goto('/');
    
    // Check paragraph spacing
    const paragraph = page.locator('p').first();
    if (await paragraph.count() > 0) {
      const marginBottom = await paragraph.evaluate((el) => 
        window.getComputedStyle(el).marginBottom
      );
      // Should have some bottom margin for readability
      expect(marginBottom).not.toBe('0px');
    }
  });
});
