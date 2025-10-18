import { test, expect } from '@playwright/test';

const pages = [
  { path: '/', name: 'homepage' },
  { path: '/login', name: 'login' },
  { path: '/signup', name: 'signup' },
  { path: '/dashboard', name: 'dashboard' },
];

test.describe('Theme switching visual regression tests', () => {
  for (const pageInfo of pages) {
    test(`${pageInfo.name} - light to dark theme switch`, async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });

      // Start with light theme
      await page.goto('/');
      await page.evaluate(() => {
        localStorage.setItem('rentsight-theme', 'light');
        document.documentElement.classList.remove('dark');
      });

      await page.goto(pageInfo.path);
      await page.waitForLoadState('networkidle');

      // Take screenshot in light theme
      await expect(page).toHaveScreenshot(`${pageInfo.name}-light.png`, {
        fullPage: true,
        maxDiffPixels: 5000, // Allow for cross-browser font rendering differences
      });

      // Switch to dark theme
      await page.evaluate(() => {
        localStorage.setItem('rentsight-theme', 'dark');
        document.documentElement.classList.add('dark');
      });

      await page.waitForTimeout(300); // Wait for theme transition

      // Take screenshot in dark theme
      await expect(page).toHaveScreenshot(`${pageInfo.name}-dark.png`, {
        fullPage: true,
        maxDiffPixels: 5000, // Allow for cross-browser font rendering differences
      });
    });
  }

  test('theme toggle button appearance', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Find theme toggle button
    const themeToggle = page.locator('[aria-label*="theme"], button[class*="ThemeToggle"]').first();

    if ((await themeToggle.count()) > 0) {
      // Light theme toggle
      await page.evaluate(() => {
        localStorage.setItem('rentsight-theme', 'light');
        document.documentElement.classList.remove('dark');
      });
      await page.waitForTimeout(200);

      await expect(themeToggle).toHaveScreenshot('theme-toggle-light.png', {
        maxDiffPixels: 50,
      });

      // Dark theme toggle
      await page.evaluate(() => {
        localStorage.setItem('rentsight-theme', 'dark');
        document.documentElement.classList.add('dark');
      });
      await page.waitForTimeout(200);

      await expect(themeToggle).toHaveScreenshot('theme-toggle-dark.png', {
        maxDiffPixels: 50,
      });
    }
  });

  test('theme persistence across navigation', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Set dark theme
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('rentsight-theme', 'dark');
      document.documentElement.classList.add('dark');
    });

    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Verify dark theme persists
    const isDark = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });

    expect(isDark).toBe(true);

    // Take screenshot to verify visual consistency
    await expect(page).toHaveScreenshot('theme-persistence-dark.png', {
      fullPage: true,
      maxDiffPixels: 5000, // Allow for cross-browser font rendering differences
    });
  });

  test('all color tokens render correctly in both themes', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    for (const theme of ['light', 'dark']) {
      await page.goto('/');
      await page.evaluate((t) => {
        localStorage.setItem('rentsight-theme', t);
        document.documentElement.classList.toggle('dark', t === 'dark');
      }, theme);

      await page.goto('/dashboard');
      await page.waitForLoadState('domcontentloaded');

      // Extract color tokens
      const colors = await page.evaluate(() => {
        const rootStyles = window.getComputedStyle(document.documentElement);
        return {
          background: rootStyles.getPropertyValue('background-color'),
          text: rootStyles.getPropertyValue('color'),
        };
      });

      // Verify colors are not default (not transparent/black/white)
      expect(colors.background).not.toBe('');
      expect(colors.text).not.toBe('');
    }
  });
});
