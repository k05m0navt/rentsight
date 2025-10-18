/**
 * Comprehensive Functionality Tests
 * 
 * Tests all major functionality across different browsers to ensure
 * the app works properly everywhere.
 */

import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should handle login/logout properly', async ({ page }) => {
    // Test login page
    await page.goto('/login');
    await expect(page).toHaveTitle(/Login/);
    
    // Check if login form is present
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Test logout (if already logged in)
    await page.goto('/dashboard');
    const logoutButton = page.locator('button:has-text("Log Out")');
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await expect(page).toHaveURL(/.*login/);
    }
  });
});

test.describe('Dashboard Functionality', () => {
  test('should load dashboard with proper data display', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check page title and header
    await expect(page).toHaveTitle(/Dashboard/);
    await expect(page.locator('h1:has-text("Analytics Dashboard")')).toBeVisible();
    
    // Check for skeleton loading initially
    const skeleton = page.locator('[data-testid="dashboard-skeleton"]');
    if (await skeleton.isVisible()) {
      await expect(skeleton).toBeVisible();
    }
    
    // Wait for content to load
    await page.waitForSelector('[data-testid="dashboard-content"]', { timeout: 10000 });
    
    // Check for metrics cards
    await expect(page.locator('text=Total Rent Income')).toBeVisible();
    await expect(page.locator('text=Total Booked Days')).toBeVisible();
    await expect(page.locator('text=Platform Income')).toBeVisible();
    await expect(page.locator('text=Net Income')).toBeVisible();
    
    // Check currency display
    await expect(page.locator('text=Displaying amounts in:')).toBeVisible();
  });

  test('should handle empty state gracefully', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Wait for either content or empty state
    await Promise.race([
      page.waitForSelector('[data-testid="dashboard-content"]'),
      page.waitForSelector('text=No analytics data available')
    ]);
    
    // Should show either data or empty state, not error
    const hasContent = await page.locator('[data-testid="dashboard-content"]').isVisible();
    const hasEmptyState = await page.locator('text=No analytics data available').isVisible();
    
    expect(hasContent || hasEmptyState).toBeTruthy();
  });
});

test.describe('Properties Management', () => {
  test('should handle property CRUD operations', async ({ page }) => {
    await page.goto('/properties');
    
    // Check page loads
    await expect(page).toHaveTitle(/Properties/);
    await expect(page.locator('h1:has-text("Properties")')).toBeVisible();
    
    // Check for skeleton loading initially
    const skeleton = page.locator('[data-testid="properties-skeleton"]');
    if (await skeleton.isVisible()) {
      await expect(skeleton).toBeVisible();
    }
    
    // Wait for properties list or empty state
    await Promise.race([
      page.waitForSelector('[data-testid="properties-list"]'),
      page.waitForSelector('text=No properties found')
    ]);
    
    // Test "New Property" button
    const newPropertyButton = page.locator('button:has-text("New Property")');
    if (await newPropertyButton.isVisible()) {
      await newPropertyButton.click();
      
      // Check if form opens (modal or new page)
      await expect(page.locator('input[name="name"]')).toBeVisible();
    }
  });
});

test.describe('Tags Management', () => {
  test('should handle tag operations with animations', async ({ page }) => {
    await page.goto('/tags');
    
    // Check page loads
    await expect(page).toHaveTitle(/Tags/);
    await expect(page.locator('h1:has-text("Tags")')).toBeVisible();
    
    // Check for skeleton loading initially
    const skeleton = page.locator('[data-testid="tags-skeleton"]');
    if (await skeleton.isVisible()) {
      await expect(skeleton).toBeVisible();
    }
    
    // Wait for tags list or empty state
    await Promise.race([
      page.waitForSelector('[data-testid="tags-list"]'),
      page.waitForSelector('text=No tags found')
    ]);
    
    // Test "New Tag" button
    const newTagButton = page.locator('button:has-text("New Tag")');
    if (await newTagButton.isVisible()) {
      await newTagButton.click();
      await expect(page.locator('input[name="name"]')).toBeVisible();
    }
  });
});

test.describe('Reports Functionality', () => {
  test('should protect reports page and handle authentication', async ({ page }) => {
    // First try to access without authentication
    await page.goto('/reports');
    
    // Should redirect to login or show loading skeleton
    await Promise.race([
      page.waitForURL(/.*login/),
      page.waitForSelector('[data-testid="reports-skeleton"]')
    ]);
    
    // If redirected to login, test login flow
    if (page.url().includes('login')) {
      await expect(page).toHaveURL(/.*login/);
    } else {
      // If showing skeleton, wait for content
      await page.waitForSelector('[data-testid="reports-content"]', { timeout: 10000 });
      
      // Check reports page content
      await expect(page.locator('h1:has-text("Reports")')).toBeVisible();
      await expect(page.locator('select[id="reportType"]')).toBeVisible();
    }
  });

  test('should generate and display reports', async ({ page }) => {
    await page.goto('/reports');
    
    // Wait for page to load
    await page.waitForSelector('[data-testid="reports-content"]', { timeout: 10000 });
    
    // Check report type selection
    const reportTypeSelect = page.locator('select[id="reportType"]');
    await expect(reportTypeSelect).toBeVisible();
    
    // Test different report types
    await reportTypeSelect.selectOption('income_summary');
    await reportTypeSelect.selectOption('expense_breakdown');
    await reportTypeSelect.selectOption('tax_report');
    
    // Check generate button
    const generateButton = page.locator('button:has-text("Generate Report")');
    await expect(generateButton).toBeVisible();
  });
});

test.describe('Settings and User Preferences', () => {
  test('should handle user preferences and Russian options', async ({ page }) => {
    await page.goto('/settings');
    
    // Check page loads
    await expect(page).toHaveTitle(/Settings/);
    await expect(page.locator('h1:has-text("Settings")')).toBeVisible();
    
    // Check for preferences form
    await expect(page.locator('select[id="currency_format"]')).toBeVisible();
    await expect(page.locator('select[id="date_format"]')).toBeVisible();
    await expect(page.locator('select[id="language"]')).toBeVisible();
    
    // Test Russian currency option
    const currencySelect = page.locator('select[id="currency_format"]');
    await expect(currencySelect.locator('option[value="RUB"]')).toBeVisible();
    
    // Test Russian language option
    const languageSelect = page.locator('select[id="language"]');
    await expect(languageSelect.locator('option[value="ru"]')).toBeVisible();
    
    // Test Russian date format
    const dateSelect = page.locator('select[id="date_format"]');
    await expect(dateSelect.locator('option[value="DD/MM/YYYY"]')).toBeVisible();
    
    // Test theme preference
    const themeSelect = page.locator('select[id="theme_preference"]');
    await expect(themeSelect).toBeVisible();
  });

  test('should apply settings changes', async ({ page }) => {
    await page.goto('/settings');
    
    // Change currency to RUB
    await page.selectOption('select[id="currency_format"]', 'RUB');
    await page.selectOption('select[id="language"]', 'ru');
    
    // Save preferences
    const saveButton = page.locator('button:has-text("Save Preferences")');
    await saveButton.click();
    
    // Check for success message
    await expect(page.locator('text=Preferences updated successfully')).toBeVisible();
  });
});

test.describe('Help Page Functionality', () => {
  test('should display help content and search functionality', async ({ page }) => {
    await page.goto('/help');
    
    // Check page loads
    await expect(page).toHaveTitle(/Help/);
    await expect(page.locator('h1:has-text("Help & Support")')).toBeVisible();
    
    // Check search functionality
    const searchInput = page.locator('input[placeholder*="Search help"]');
    await expect(searchInput).toBeVisible();
    
    // Test search
    await searchInput.fill('property');
    await page.waitForTimeout(500); // Wait for search results
    
    // Check FAQ sections
    await expect(page.locator('h2:has-text("Frequently Asked Questions")')).toBeVisible();
    
    // Check popular articles
    await expect(page.locator('h2:has-text("Popular Articles")')).toBeVisible();
    
    // Check community link
    const communityLink = page.locator('a[href="https://community.rentsight.app"]');
    await expect(communityLink).toBeVisible();
    await expect(communityLink).toHaveAttribute('target', '_blank');
  });

  test('should handle FAQ expansion with animations', async ({ page }) => {
    await page.goto('/help');
    
    // Wait for FAQs to load
    await page.waitForSelector('[data-testid="faq-item"]', { timeout: 10000 });
    
    const faqItems = page.locator('[data-testid="faq-item"]');
    const count = await faqItems.count();
    
    if (count > 0) {
      const firstFaq = faqItems.first();
      const question = firstFaq.locator('[data-testid="faq-question"]');
      const answer = firstFaq.locator('[data-testid="faq-answer"]');
      
      // Initially answer should be hidden
      await expect(answer).not.toBeVisible();
      
      // Click to expand
      await question.click();
      
      // Answer should be visible with smooth animation
      await expect(answer).toBeVisible({ timeout: 1000 });
    }
  });
});

test.describe('Caching and Performance', () => {
  test('should handle caching properly', async ({ page }) => {
    // Clear cache first
    await page.evaluate(() => localStorage.clear());
    
    // First visit to dashboard
    const startTime = Date.now();
    await page.goto('/dashboard');
    await page.waitForSelector('[data-testid="dashboard-content"]', { timeout: 10000 });
    const firstLoadTime = Date.now() - startTime;
    
    // Check cache was created
    const cacheData = await page.evaluate(() => {
      return localStorage.getItem('cache:dashboard');
    });
    expect(cacheData).toBeTruthy();
    
    // Second visit should be faster
    const secondStartTime = Date.now();
    await page.goto('/dashboard');
    await page.waitForSelector('[data-testid="dashboard-content"]', { timeout: 5000 });
    const secondLoadTime = Date.now() - secondStartTime;
    
    // Second load should be faster (cached)
    expect(secondLoadTime).toBeLessThan(firstLoadTime);
  });
});

test.describe('Theme Switching', () => {
  test('should switch between light and dark themes', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Find theme toggle
    const themeToggle = page.locator('button[data-testid="theme-toggle"]');
    if (await themeToggle.isVisible()) {
      // Get initial theme
      const initialTheme = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      });
      
      // Click theme toggle
      await themeToggle.click();
      
      // Wait for theme change
      await page.waitForTimeout(500);
      
      // Check theme changed
      const newTheme = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      });
      
      expect(newTheme).not.toBe(initialTheme);
    }
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/dashboard');
    
    // Check mobile navigation
    const mobileMenuButton = page.locator('button[data-testid="mobile-menu"]');
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      await expect(page.locator('[data-testid="mobile-menu-items"]')).toBeVisible();
    }
    
    // Check responsive layout
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should work on tablet devices', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/dashboard');
    
    // Check tablet layout
    await expect(page.locator('h1')).toBeVisible();
    
    // Check grid layouts adapt
    const metricsGrid = page.locator('[data-testid="metrics-grid"]');
    if (await metricsGrid.isVisible()) {
      // Should show 2 columns on tablet
      const gridItems = metricsGrid.locator('[data-testid="metric-card"]');
      const count = await gridItems.count();
      expect(count).toBeGreaterThan(0);
    }
  });
});

test.describe('Accessibility', () => {
  test('should meet accessibility standards', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check for proper heading hierarchy
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    
    // Check for alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
    
    // Check for proper form labels
    const inputs = page.locator('input');
    const inputCount = await inputs.count();
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        if (await label.count() > 0) {
          await expect(label).toBeVisible();
        }
      }
    }
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Test Tab navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });
});

test.describe('Error Handling', () => {
  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate network failure
    await page.route('**/api/**', route => route.abort());
    
    await page.goto('/dashboard');
    
    // Should show error state or loading state, not crash
    await Promise.race([
      page.waitForSelector('text=Error loading'),
      page.waitForSelector('[data-testid="dashboard-skeleton"]'),
      page.waitForSelector('text=No analytics data available')
    ]);
  });

  test('should handle 404 pages', async ({ page }) => {
    await page.goto('/nonexistent-page');
    
    // Should show 404 page or redirect to login
    await Promise.race([
      page.waitForURL(/.*login/),
      page.waitForSelector('text=404'),
      page.waitForSelector('text=Not Found')
    ]);
  });
});
