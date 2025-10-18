import { test, expect } from '@playwright/test';

test.describe('Card Component Styling', () => {
  test('should display cards with proper rounded corners', async ({ page }) => {
    await page.goto('/dashboard');

    const card = page.locator('[class*="bg-card"]').first();
    if ((await card.count()) > 0) {
      const borderRadius = await card.evaluate((el) => window.getComputedStyle(el).borderRadius);
      expect(['8px', '12px']).toContain(borderRadius);
    }
  });

  test('should have proper shadow styling on cards', async ({ page }) => {
    await page.goto('/dashboard');

    const card = page.locator('[class*="bg-card"]').first();
    if ((await card.count()) > 0) {
      const boxShadow = await card.evaluate((el) => window.getComputedStyle(el).boxShadow);
      expect(boxShadow).not.toBe('none');
    }
  });

  test('should have consistent card padding', async ({ page }) => {
    await page.goto('/dashboard');

    const card = page.locator('[class*="bg-card"]').first();
    if ((await card.count()) > 0) {
      const padding = await card.evaluate((el) => window.getComputedStyle(el).padding);

      const paddingValues = padding.split(' ').map((val) => parseInt(val));
      paddingValues.forEach((value) => {
        if (!isNaN(value)) {
          expect([16, 24, 32]).toContain(value);
        }
      });
    }
  });

  test('should display cards with correct dark theme background', async ({ page }) => {
    await page.goto('/dashboard');
    await page.evaluate(() => document.documentElement.classList.add('dark'));

    const card = page.locator('[class*="bg-card"]').first();
    if ((await card.count()) > 0) {
      const backgroundColor = await card.evaluate(
        (el) => window.getComputedStyle(el).backgroundColor,
      );
      expect(backgroundColor).toBe('rgb(42, 42, 42)'); // #2A2A2A
    }
  });

  test('should have hover state styling for interactive cards', async ({ page }) => {
    await page.goto('/dashboard');

    const interactiveCard = page.locator('[class*="cursor-pointer"]').first();
    if ((await interactiveCard.count()) > 0) {
      await interactiveCard.hover();
      await page.waitForTimeout(300); // Wait for transition

      const boxShadow = await interactiveCard.evaluate(
        (el) => window.getComputedStyle(el).boxShadow,
      );
      expect(boxShadow).not.toBe('none');
    }
  });

  test('should maintain card spacing consistency', async ({ page }) => {
    await page.goto('/dashboard');

    // Take screenshot for visual regression testing
    await expect(page).toHaveScreenshot('card-styling-consistency.png');
  });

  test('should display cards properly in light theme', async ({ page }) => {
    await page.goto('/dashboard');
    await page.evaluate(() => document.documentElement.classList.remove('dark'));

    const card = page.locator('[class*="bg-card"]').first();
    if ((await card.count()) > 0) {
      const backgroundColor = await card.evaluate(
        (el) => window.getComputedStyle(el).backgroundColor,
      );
      expect(backgroundColor).toBe('rgb(245, 245, 245)'); // #F5F5F5
    }
  });

  test('should have proper card spacing in responsive layouts', async ({ page }) => {
    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dashboard');
    await expect(page).toHaveScreenshot('card-styling-mobile.png');

    // Desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/dashboard');
    await expect(page).toHaveScreenshot('card-styling-desktop.png');
  });
});
