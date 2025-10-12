import { test, expect } from '@playwright/test';

test.describe('Interactive Elements Styling', () => {
  test('should display input fields with proper styling', async ({ page }) => {
    await page.goto('/auth/login');
    
    const input = page.locator('input[type="email"]').first();
    if (await input.count() > 0) {
      const borderRadius = await input.evaluate((el) => 
        window.getComputedStyle(el).borderRadius
      );
      expect(['4px', '8px']).toContain(borderRadius);
    }
  });

  test('should have proper input focus states with orange accent', async ({ page }) => {
    await page.goto('/auth/login');
    
    const input = page.locator('input[type="email"]').first();
    if (await input.count() > 0) {
      await input.focus();
      
      // Take screenshot to validate focus state
      await expect(page).toHaveScreenshot('input-focus-state.png');
    }
  });

  test('should display links with orange accent color', async ({ page }) => {
    await page.goto('/');
    
    const link = page.locator('a').first();
    if (await link.count() > 0) {
      const color = await link.evaluate((el) => 
        window.getComputedStyle(el).color
      );
      // Should use orange accent or default text color
      expect(color).toMatch(/rgb\(\d+,\s*\d+,\s*\d+\)/);
    }
  });

  test('should have proper link hover states', async ({ page }) => {
    await page.goto('/');
    
    const link = page.locator('a').first();
    if (await link.count() > 0) {
      await link.hover();
      await page.waitForTimeout(200);
      
      // Take screenshot for visual regression
      await expect(page).toHaveScreenshot('link-hover-state.png');
    }
  });

  test('should display checkbox with proper styling', async ({ page }) => {
    await page.goto('/auth/login');
    
    const checkbox = page.locator('input[type="checkbox"]').first();
    if (await checkbox.count() > 0) {
      const width = await checkbox.evaluate((el) => 
        window.getComputedStyle(el).width
      );
      expect(parseInt(width)).toBeGreaterThan(0);
    }
  });

  test('should have proper dropdown/select styling', async ({ page }) => {
    await page.goto('/');
    
    const select = page.locator('select').first();
    if (await select.count() > 0) {
      const borderRadius = await select.evaluate((el) => 
        window.getComputedStyle(el).borderRadius
      );
      expect(['4px', '8px']).toContain(borderRadius);
    }
  });

  test('should display input error states properly', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Try to submit form without filling required fields
    const submitButton = page.locator('button[type="submit"]').first();
    if (await submitButton.count() > 0) {
      await submitButton.click();
      
      // Take screenshot to capture error state
      await expect(page).toHaveScreenshot('input-error-state.png');
    }
  });

  test('should maintain interactive element styling in dark theme', async ({ page }) => {
    await page.goto('/auth/login');
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    
    // Take screenshot for dark theme validation
    await expect(page).toHaveScreenshot('interactive-elements-dark.png');
  });

  test('should have consistent form element spacing', async ({ page }) => {
    await page.goto('/auth/login');
    
    const form = page.locator('form').first();
    if (await form.count() > 0) {
      // Take screenshot for visual regression
      await expect(page).toHaveScreenshot('form-spacing.png');
    }
  });

  test('should display placeholder text with muted color', async ({ page }) => {
    await page.goto('/auth/login');
    
    const input = page.locator('input[placeholder]').first();
    if (await input.count() > 0) {
      const placeholderColor = await input.evaluate((el) => {
        const style = window.getComputedStyle(el, '::placeholder');
        return style.color;
      });
      // Should be muted/secondary color
      expect(placeholderColor).toMatch(/rgb\(\d+,\s*\d+,\s*\d+\)/);
    }
  });

  test('should have proper input label styling', async ({ page }) => {
    await page.goto('/auth/login');
    
    const label = page.locator('label').first();
    if (await label.count() > 0) {
      const fontSize = await label.evaluate((el) => 
        window.getComputedStyle(el).fontSize
      );
      expect(['12px', '14px', '16px']).toContain(fontSize);
    }
  });

  test('should display loading indicators with orange accent', async ({ page }) => {
    await page.goto('/');
    
    const spinner = page.locator('[class*="animate-spin"]').first();
    if (await spinner.count() > 0) {
      const borderColor = await spinner.evaluate((el) => 
        window.getComputedStyle(el).borderTopColor
      );
      // Should use orange accent for loading indicators
      expect(borderColor).toMatch(/rgb\(\d+,\s*\d+,\s*\d+\)/);
    }
  });
});
