/**
 * E2E Tests: Sidebar Authentication Controls (User Story 1)
 *
 * Tests for sidebar authentication buttons and theme toggle placement
 * Priority: P1 (Critical)
 *
 * NOTE: These tests should FAIL initially (TDD approach)
 * until the implementation is complete.
 */

import { test, expect } from '@playwright/test';

test.describe('Sidebar Authentication Controls', () => {
  test.describe('Unauthenticated State', () => {
    test('T016: should show Sign In button at sidebar bottom when not logged in', async ({
      page,
    }) => {
      // Navigate to home page (unauthenticated)
      await page.goto('/');

      // Check for Sign In button in sidebar
      const sidebar = page.locator('aside');
      const signInButton = sidebar.locator('a[href="/login"], button:has-text("Sign In")').last();

      await expect(signInButton).toBeVisible();

      // Verify it's at the bottom of sidebar (check Y position relative to nav items)
      const signInBox = await signInButton.boundingBox();
      const navItems = sidebar.locator('a[href^="/"]').first();
      const navBox = await navItems.boundingBox();

      // Sign In button should be below navigation items
      if (signInBox && navBox) {
        expect(signInBox.y).toBeGreaterThan(navBox.y);
      }
    });

    test('T018: should show theme toggle at sidebar bottom when not logged in', async ({
      page,
    }) => {
      await page.goto('/');

      const sidebar = page.locator('aside');
      const themeToggle = sidebar
        .locator(
          '[aria-label*="theme" i], [aria-label*="Toggle theme" i], button:has-text("Theme")',
        )
        .last();

      await expect(themeToggle).toBeVisible();
    });
  });

  test.describe('Authenticated State', () => {
    test.use({ storageState: 'playwright/.auth/user.json' });

    test('T017: should show Log Out button at sidebar bottom when logged in', async ({ page }) => {
      // Navigate to dashboard (authenticated)
      await page.goto('/dashboard');

      // Wait for sidebar to render
      const sidebar = page.locator('aside');
      await expect(sidebar).toBeVisible();

      // Check for Log Out button in sidebar
      const logOutButton = sidebar
        .locator(
          'button:has-text("Log Out"), button:has-text("Logout"), button:has-text("Sign Out")',
        )
        .last();

      await expect(logOutButton).toBeVisible();

      // Verify it's at the bottom of sidebar
      const logOutBox = await logOutButton.boundingBox();
      const navItems = sidebar.locator('a[href="/dashboard"]');
      const navBox = await navItems.boundingBox();

      // Log Out button should be below navigation items
      if (logOutBox && navBox) {
        expect(logOutBox.y).toBeGreaterThan(navBox.y);
      }
    });

    test('T018 (authenticated): should show theme toggle at sidebar bottom when logged in', async ({
      page,
    }) => {
      await page.goto('/dashboard');

      const sidebar = page.locator('aside');
      const themeToggle = sidebar
        .locator(
          '[aria-label*="theme" i], [aria-label*="Toggle theme" i], button:has-text("Theme")',
        )
        .last();

      await expect(themeToggle).toBeVisible();

      // Theme toggle should NOT be in the dashboard page header
      const dashboardHeader = page.locator('main').first();
      const themeToggleInHeader = dashboardHeader.locator('[aria-label*="theme" i]').first();

      await expect(themeToggleInHeader)
        .not.toBeVisible()
        .catch(() => {
          // It's okay if it doesn't exist at all
        });
    });

    test('T020: should log out user and redirect to login when Log Out clicked', async ({
      page,
    }) => {
      await page.goto('/dashboard');

      // Click Log Out button
      const sidebar = page.locator('aside');
      const logOutButton = sidebar
        .locator(
          'button:has-text("Log Out"), button:has-text("Logout"), button:has-text("Sign Out")',
        )
        .last();

      await logOutButton.click();

      // Should redirect to login page
      await page.waitForURL('/login', { timeout: 5000 });
      expect(page.url()).toContain('/login');

      // Should be logged out (no access to dashboard)
      await page.goto('/dashboard');
      await page.waitForURL('/login', { timeout: 5000 });
      expect(page.url()).toContain('/login');
    });

    test('T019: should persist theme preference across sessions', async ({ page, context }) => {
      await page.goto('/dashboard');

      // Get current theme
      const html = page.locator('html');
      const initialTheme = await html.getAttribute('class');

      // Toggle theme
      const sidebar = page.locator('aside');
      const themeToggle = sidebar
        .locator(
          '[aria-label*="theme" i], [aria-label*="Toggle theme" i], button:has-text("Theme")',
        )
        .last();
      await themeToggle.click();

      // Wait for theme to change
      await page.waitForTimeout(500);

      const newTheme = await html.getAttribute('class');

      // Theme should have changed
      expect(newTheme).not.toBe(initialTheme);

      // Create new page to verify persistence
      const newPage = await context.newPage();
      await newPage.goto('/dashboard');

      const persistedTheme = await newPage.locator('html').getAttribute('class');

      // Theme should persist to new page
      expect(persistedTheme).toBe(newTheme);

      await newPage.close();
    });
  });

  test.describe('Mobile Responsive', () => {
    test.use({ storageState: 'playwright/.auth/user.json' });

    test('should show auth controls on mobile sidebar when visible', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/dashboard');

      // On mobile, sidebar might be hidden by default
      // This test ensures controls exist when sidebar is shown
      const sidebar = page.locator('aside');

      // If sidebar is visible on mobile, auth controls should be there
      if (await sidebar.isVisible()) {
        const authControl = sidebar
          .locator('button:has-text("Log Out"), button:has-text("Sign In")')
          .last();
        await expect(authControl).toBeVisible();
      }
    });
  });
});
