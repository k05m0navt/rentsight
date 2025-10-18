import { test, expect } from '@playwright/test';

const viewports = [
  { width: 375, height: 667, name: 'mobile' }, // iPhone SE
  { width: 768, height: 1024, name: 'tablet' }, // iPad
  { width: 1920, height: 1080, name: 'desktop' }, // Desktop
];

const themes = ['light', 'dark'];

test.describe('Navigation visual regression tests', () => {
  for (const theme of themes) {
    for (const viewport of viewports) {
      test(`navigation ${theme} theme at ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('/');

        // Set theme
        await page.evaluate((t) => {
          localStorage.setItem('rentsight-theme', t);
          document.documentElement.classList.toggle('dark', t === 'dark');
        }, theme);

        await page.waitForLoadState('networkidle');

        // Wait for navigation to be visible
        if (viewport.width >= 768) {
          // Desktop/Tablet - wait for sidebar
          await page.waitForSelector('aside', { state: 'visible' });
        } else {
          // Mobile - wait for bottom nav
          await page.waitForSelector('nav[class*="bottom"]', { state: 'visible' });
        }

        // Take screenshot of the entire page
        await expect(page).toHaveScreenshot(`navigation-${theme}-${viewport.name}.png`, {
          fullPage: true,
          maxDiffPixels: 5000, // Allow for cross-browser font rendering differences
        });
      });

      test(`navigation hover states ${theme} ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Skip hover test on mobile (hover doesn't apply to touch devices)
        if (viewport.width < 768) {
          test.skip();
          return;
        }

        // Find navigation items in sidebar (desktop/tablet only)
        const navItems = await page.locator('aside a').all();

        if (navItems.length > 0) {
          // Hover over first navigation item
          await navItems[0].hover();
          await page.waitForTimeout(200); // Wait for hover animation

          await expect(page).toHaveScreenshot(`navigation-hover-${theme}-${viewport.name}.png`, {
            maxDiffPixels: 5000, // Allow for cross-browser font rendering differences
          });
        }
      });
    }
  }

  test('sidebar to bottom nav transition at 768px', async ({ page }) => {
    // Start at desktop size
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify sidebar is visible
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();

    // Take screenshot at desktop
    await expect(page).toHaveScreenshot('navigation-desktop-sidebar.png', {
      maxDiffPixels: 5000, // Allow for cross-browser font rendering differences
    });

    // Resize to mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(300); // Wait for responsive changes

    // Verify sidebar is hidden and bottom nav is visible
    await expect(sidebar).not.toBeVisible();
    const bottomNav = page.locator('nav[class*="bottom"]');
    await expect(bottomNav).toBeVisible();

    // Take screenshot at mobile
    await expect(page).toHaveScreenshot('navigation-mobile-bottomnav.png', {
      maxDiffPixels: 5000, // Allow for cross-browser font rendering differences
    });
  });

  test('active navigation state highlighting', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Take screenshot showing active state
    await expect(page).toHaveScreenshot('navigation-active-state.png', {
      maxDiffPixels: 5000, // Allow for cross-browser font rendering differences
    });
  });
});
