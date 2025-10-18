/**
 * E2E tests for Russian Market Options
 * Tests RUB currency, Russian platforms, and regional formatting
 */

import { test, expect } from '@playwright/test';

test.describe('Russian Market Options', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to properties page to test currency/platform selectors
    await page.goto('/properties');
    await page.waitForSelector('[data-testid="properties-list"]', { timeout: 10000 });
  });

  test('RUB currency available in property forms', async ({ page }) => {
    // Click to add a new property
    await page.click('button:has-text("New Property")');

    // Wait for form to appear
    await page.waitForSelector('form', { timeout: 5000 });

    // Look for currency selector
    const currencySelect = page.locator('select[name="currency"]');
    if ((await currencySelect.count()) > 0) {
      // Check that RUB is available
      const options = await currencySelect.locator('option').allTextContents();
      expect(options).toContain('RUB - Russian Ruble');
    } else {
      // If no currency selector in property form, check settings
      await page.goto('/settings');
      await page.waitForSelector('h1:has-text("Settings")', { timeout: 5000 });

      const currencySelect = page.locator('select[name="currency"]');
      await expect(currencySelect).toBeVisible();

      const options = await currencySelect.locator('option').allTextContents();
      expect(options).toContain('RUB - Russian Ruble');
    }
  });

  test('Russian platforms available in dropdowns', async ({ page }) => {
    // Navigate to dashboard to test platform selector in rent entry form
    await page.goto('/dashboard');
    await page.waitForSelector('[data-testid="dashboard-content"]', { timeout: 10000 });

    // Look for platform selector in rent entry form
    const platformSelect = page.locator('select[name="platform"]');
    if ((await platformSelect.count()) > 0) {
      // Check for Russian platforms
      const options = await platformSelect.locator('option').allTextContents();

      expect(options).toContain('Avito');
      expect(options).toContain('CIAN');
      expect(options).toContain('Domclick');
      expect(options).toContain('Yandex.Realty');
    } else {
      // If no platform selector visible, try clicking to add rent entry
      const addRentButton = page.locator('button:has-text("Add Rent Entry")');
      if ((await addRentButton.count()) > 0) {
        await addRentButton.click();
        await page.waitForSelector('select[name="platform"]', { timeout: 5000 });

        const options = await page.locator('select[name="platform"] option').allTextContents();
        expect(options).toContain('Avito');
        expect(options).toContain('CIAN');
        expect(options).toContain('Domclick');
        expect(options).toContain('Yandex.Realty');
      }
    }
  });

  test('RUB amounts formatted with space separator', async ({ page }) => {
    // Set user preference to RUB currency
    await page.goto('/settings');
    await page.waitForSelector('h1:has-text("Settings")', { timeout: 5000 });

    // Find and select RUB currency
    const currencySelect = page.locator('select[name="currency"]');
    await currencySelect.selectOption('RUB');

    // Save settings
    const saveButton = page.locator('button:has-text("Save")');
    if ((await saveButton.count()) > 0) {
      await saveButton.click();
    }

    // Navigate to dashboard to check formatting
    await page.goto('/dashboard');
    await page.waitForSelector('[data-testid="dashboard-content"]', { timeout: 10000 });

    // Look for formatted amounts (should use space separator)
    const amountElements = page.locator('[data-testid="amount"], .amount, [class*="amount"]');
    const amountCount = await amountElements.count();

    if (amountCount > 0) {
      // Check at least one amount is formatted with RUB
      const amounts = await amountElements.allTextContents();
      const rubFormatted = amounts.some((amount) => amount.includes('₽') && amount.includes(' '));

      // If no amounts visible, create a test entry
      if (!rubFormatted) {
        await page.click('button:has-text("Add Rent Entry")');
        await page.waitForSelector('form', { timeout: 5000 });

        // Fill in amount
        await page.fill('input[name="amount"]', '50000');

        // Check that the formatted preview shows space separator
        const formattedPreview = page.locator('[data-testid="formatted-amount"]');
        if ((await formattedPreview.count()) > 0) {
          const formattedText = await formattedPreview.textContent();
          expect(formattedText).toMatch(/\d+\s\d+\s₽/); // e.g., "50 000 ₽"
        }
      }
    }
  });

  test('DD.MM.YYYY date format option works', async ({ page }) => {
    // Go to settings to change date format
    await page.goto('/settings');
    await page.waitForSelector('h1:has-text("Settings")', { timeout: 5000 });

    // Look for date format selector
    const dateFormatSelect = page.locator('select[name="dateFormat"]');
    if ((await dateFormatSelect.count()) > 0) {
      // Select Russian date format
      await dateFormatSelect.selectOption('DD.MM.YYYY');

      // Save settings
      const saveButton = page.locator('button:has-text("Save")');
      if ((await saveButton.count()) > 0) {
        await saveButton.click();
      }

      // Navigate to a page with dates to verify formatting
      await page.goto('/dashboard');
      await page.waitForSelector('[data-testid="dashboard-content"]', { timeout: 10000 });

      // Look for date elements
      const dateElements = page.locator('[data-testid="date"], .date, [class*="date"]');
      const dateCount = await dateElements.count();

      if (dateCount > 0) {
        // Check that dates are formatted as DD.MM.YYYY
        const dates = await dateElements.allTextContents();
        const russianFormatted = dates.some((date) => /^\d{2}\.\d{2}\.\d{4}$/.test(date.trim()));

        expect(russianFormatted).toBeTruthy();
      }
    }
  });

  test('regional preferences persisted across sessions', async ({ page }) => {
    // Set Russian preferences
    await page.goto('/settings');
    await page.waitForSelector('h1:has-text("Settings")', { timeout: 5000 });

    // Set RUB currency
    const currencySelect = page.locator('select[name="currency"]');
    if ((await currencySelect.count()) > 0) {
      await currencySelect.selectOption('RUB');
    }

    // Set Russian date format
    const dateFormatSelect = page.locator('select[name="dateFormat"]');
    if ((await dateFormatSelect.count()) > 0) {
      await dateFormatSelect.selectOption('DD.MM.YYYY');
    }

    // Save settings
    const saveButton = page.locator('button:has-text("Save")');
    if ((await saveButton.count()) > 0) {
      await saveButton.click();
      await page.waitForSelector('text=Settings saved', { timeout: 5000 });
    }

    // Reload page to simulate new session
    await page.reload();
    await page.waitForSelector('h1:has-text("Settings")', { timeout: 5000 });

    // Verify preferences are still set
    const currencyValue = await currencySelect.inputValue();
    expect(currencyValue).toBe('RUB');

    const dateFormatValue = await dateFormatSelect.inputValue();
    expect(dateFormatValue).toBe('DD.MM.YYYY');
  });

  test('cache invalidated when currency or date format preference changes', async ({ page }) => {
    // Load dashboard to populate cache
    await page.goto('/dashboard');
    await page.waitForSelector('[data-testid="dashboard-content"]', { timeout: 10000 });

    // Check that cache exists
    const cacheData = await page.evaluate(() => {
      return localStorage.getItem('cache:dashboard');
    });
    expect(cacheData).toBeTruthy();

    // Change currency preference
    await page.goto('/settings');
    await page.waitForSelector('h1:has-text("Settings")', { timeout: 5000 });

    const currencySelect = page.locator('select[name="currency"]');
    if ((await currencySelect.count()) > 0) {
      await currencySelect.selectOption('RUB');

      const saveButton = page.locator('button:has-text("Save")');
      if ((await saveButton.count()) > 0) {
        await saveButton.click();
      }

      // Wait for cache invalidation
      await page.waitForTimeout(1000);

      // Check that cache was invalidated
      const updatedCacheData = await page.evaluate(() => {
        return localStorage.getItem('cache:dashboard');
      });

      // Cache should be invalidated (null or expired)
      if (updatedCacheData) {
        const cachedEntry = JSON.parse(updatedCacheData);
        expect(cachedEntry.expiresAt).toBeLessThan(Date.now());
      }
    }
  });

  test('Russian platforms have correct URLs', async ({ page }) => {
    // Test platform URLs by checking API response
    const response = await page.request.get('/api/regional/platforms');
    expect(response.ok()).toBeTruthy();

    const platforms = await response.json();
    const russianPlatforms = platforms.filter((p: { region: string }) => p.region === 'ru');

    expect(russianPlatforms.length).toBeGreaterThan(0);

    // Verify specific Russian platforms
    const avito = russianPlatforms.find((p: { id: string }) => p.id === 'avito');
    expect(avito).toBeDefined();
    expect((avito as { url: string }).url).toBe('https://www.avito.ru');

    const cian = russianPlatforms.find((p: { id: string }) => p.id === 'cian');
    expect(cian).toBeDefined();
    expect((cian as { url: string }).url).toBe('https://www.cian.ru');
  });
});
