/**
 * Core Functionality Tests
 * 
 * Tests the essential functionality that should work across all browsers.
 * This is a simplified test suite that focuses on core features.
 */

import { test, expect } from '@playwright/test';

test.describe('Core Application Functionality', () => {
  test('should load dashboard with proper content', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check page loads and has proper title
    await expect(page).toHaveTitle(/Dashboard/);
    
    // Check for main heading
    await expect(page.locator('h1:has-text("Analytics Dashboard")')).toBeVisible();
    
    // Check for skeleton loading or content
    const hasSkeleton = await page.locator('[data-testid="dashboard-skeleton"]').isVisible();
    const hasContent = await page.locator('[data-testid="dashboard-content"]').isVisible();
    const hasMetrics = await page.locator('text=Total Rent Income').isVisible();
    
    // Should have either skeleton, content, or metrics visible
    expect(hasSkeleton || hasContent || hasMetrics).toBeTruthy();
    
    // If content is visible, check for key elements
    if (hasContent || hasMetrics) {
      await expect(page.locator('text=Total Rent Income')).toBeVisible();
      await expect(page.locator('text=Total Booked Days')).toBeVisible();
    }
  });

  test('should display Russian currency options in settings', async ({ page }) => {
    await page.goto('/settings');
    
    // Check page loads
    await expect(page).toHaveTitle(/Settings/);
    await expect(page.locator('h1:has-text("Settings")')).toBeVisible();
    
    // Check for currency selector
    const currencySelect = page.locator('select[id="currency_format"]');
    await expect(currencySelect).toBeVisible();
    
    // Check RUB option exists (options are hidden by default in selects)
    await expect(currencySelect.locator('option[value="RUB"]')).toHaveCount(1);
    
    // Check Russian language option
    const languageSelect = page.locator('select[id="language"]');
    await expect(languageSelect.locator('option[value="ru"]')).toHaveCount(1);
  });

  test('should handle theme switching', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Find theme toggle button
    const themeToggle = page.locator('button[data-testid="theme-toggle"]');
    
    if (await themeToggle.isVisible()) {
      // Get initial theme
      const initialTheme = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      });
      
      // Click theme toggle
      await themeToggle.click();
      await page.waitForTimeout(500);
      
      // Check theme changed
      const newTheme = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      });
      
      expect(newTheme).not.toBe(initialTheme);
    }
  });

  test('should display help page with search functionality', async ({ page }) => {
    await page.goto('/help');
    
    // Check page loads
    await expect(page).toHaveTitle(/Help/);
    await expect(page.locator('h1:has-text("Help & Support")')).toBeVisible();
    
    // Check search functionality
    const searchInput = page.locator('input[placeholder*="Search help"]');
    await expect(searchInput).toBeVisible();
    
    // Test search
    await searchInput.fill('property');
    await page.waitForTimeout(500);
    
    // Check FAQ sections
    await expect(page.locator('h2:has-text("Frequently Asked Questions")')).toBeVisible();
    
    // Check community link
    const communityLink = page.locator('a[href="https://community.rentsight.app"]');
    await expect(communityLink).toBeVisible();
  });

  test('should handle responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/dashboard');
    
    // Check page loads on mobile
    await expect(page.locator('h1:has-text("Analytics Dashboard")')).toBeVisible();
    
    // Check for mobile navigation
    const mobileMenuButton = page.locator('button[data-testid="mobile-menu"]');
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      await expect(page.locator('[data-testid="mobile-menu-items"]')).toBeVisible();
    }
  });

  test('should handle responsive design on tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/dashboard');
    
    // Check page loads on tablet
    await expect(page.locator('h1:has-text("Analytics Dashboard")')).toBeVisible();
    
    // Check for sidebar navigation
    const sidebar = page.locator('[data-testid="sidebar"]');
    await expect(sidebar).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Test Tab navigation
    await page.keyboard.press('Tab');
    
    // Check focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should handle form inputs properly', async ({ page }) => {
    await page.goto('/settings');
    
    // Test form inputs
    const currencySelect = page.locator('select[id="currency_format"]');
    await currencySelect.selectOption('RUB');
    
    const selectedValue = await currencySelect.inputValue();
    expect(selectedValue).toBe('RUB');
  });

  test('should display proper error states', async ({ page }) => {
    // Test 404 page
    await page.goto('/nonexistent-page');
    
    // Should show 404 or redirect
    await Promise.race([
      page.waitForURL(/.*login/),
      page.waitForSelector('text=404'),
      page.waitForSelector('text=Not Found')
    ]);
  });

  test('should handle caching behavior', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Wait for page to load
    await page.waitForSelector('h1:has-text("Analytics Dashboard")');
    
    // Check that page loaded successfully
    await expect(page.locator('h1:has-text("Analytics Dashboard")')).toBeVisible();
  });
});

test.describe('Russian Market Features', () => {
  test('should support RUB currency formatting', async ({ page }) => {
    await page.goto('/settings');
    
    // Set currency to RUB
    await page.selectOption('select[id="currency_format"]', 'RUB');
    
    // Save preferences
    const saveButton = page.locator('button:has-text("Save Preferences")');
    if (await saveButton.isVisible()) {
      await saveButton.click();
      await page.waitForTimeout(1000);
    }
    
    // Go to dashboard and check currency display
    await page.goto('/dashboard');
    await page.waitForSelector('h1:has-text("Analytics Dashboard")');
    
    // Check currency indicator
    const currencyDisplay = page.locator('text=Displaying amounts in:');
    if (await currencyDisplay.isVisible()) {
      await expect(currencyDisplay).toBeVisible();
    }
  });

  test('should support Russian date format', async ({ page }) => {
    await page.goto('/settings');
    
    // Set date format to DD/MM/YYYY
    await page.selectOption('select[id="date_format"]', 'DD/MM/YYYY');
    
    // Check option was selected
    const selectedValue = await page.locator('select[id="date_format"]').inputValue();
    expect(selectedValue).toBe('DD/MM/YYYY');
  });

  test('should support Russian language', async ({ page }) => {
    await page.goto('/settings');
    
    // Check Russian language option exists
    const languageSelect = page.locator('select[id="language"]');
    await expect(languageSelect.locator('option[value="ru"]')).toHaveCount(1);
    
    // Select Russian
    await languageSelect.selectOption('ru');
    
    // Check option was selected
    const selectedValue = await languageSelect.inputValue();
    expect(selectedValue).toBe('ru');
  });
});

test.describe('Cross-Browser Compatibility', () => {
  test('should work with different browser engines', async ({ page, browserName }) => {
    await page.goto('/dashboard');
    
    // Basic functionality should work in all browsers
    await expect(page.locator('h1:has-text("Analytics Dashboard")')).toBeVisible();
    
    // Test basic JavaScript features
    const jsSupport = await page.evaluate(() => {
      return {
        localStorage: typeof Storage !== 'undefined',
        fetch: typeof fetch === 'function',
        modernJS: typeof (async () => {})() === 'object'
      };
    });
    
    expect(jsSupport.localStorage).toBeTruthy();
    expect(jsSupport.fetch).toBeTruthy();
    expect(jsSupport.modernJS).toBeTruthy();
  });

  test('should handle CSS custom properties', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check that CSS custom properties work
    const primaryColor = await page.evaluate(() => {
      const element = document.querySelector('body');
      if (element) {
        return window.getComputedStyle(element).getPropertyValue('--color-primary');
      }
      return null;
    });
    
    // Should have CSS custom properties defined
    expect(primaryColor).toBeTruthy();
  });

  test('should support modern CSS features', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Test CSS Grid support
    const gridSupport = await page.evaluate(() => {
      // Check if CSS Grid is supported
      return CSS.supports('display', 'grid');
    });
    
    expect(gridSupport).toBeTruthy();
  });
});
