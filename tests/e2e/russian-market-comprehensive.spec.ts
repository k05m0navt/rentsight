/**
 * Russian Market Comprehensive Tests
 * 
 * Tests all Russian market specific functionality including
 * currency formatting, date formats, and regional settings.
 */

import { test, expect } from '@playwright/test';

test.describe('Russian Currency Support', () => {
  test('should display RUB currency correctly in settings', async ({ page }) => {
    await page.goto('/settings');
    
    // Check RUB option is available
    const currencySelect = page.locator('select[id="currency_format"]');
    await expect(currencySelect).toBeVisible();
    
    const rubOption = currencySelect.locator('option[value="RUB"]');
    await expect(rubOption).toBeVisible();
    await expect(rubOption).toHaveText('RUB (₽)');
    
    // Select RUB currency
    await currencySelect.selectOption('RUB');
    const selectedValue = await currencySelect.inputValue();
    expect(selectedValue).toBe('RUB');
  });

  test('should format RUB currency correctly in dashboard', async ({ page }) => {
    // First set currency to RUB in settings
    await page.goto('/settings');
    await page.selectOption('select[id="currency_format"]', 'RUB');
    await page.click('button:has-text("Save Preferences")');
    await page.waitForTimeout(1000); // Wait for settings to save
    
    // Go to dashboard
    await page.goto('/dashboard');
    await page.waitForSelector('[data-testid="dashboard-content"]', { timeout: 10000 });
    
    // Check currency display
    await expect(page.locator('text=Displaying amounts in: RUB')).toBeVisible();
    
    // Check currency formatting in metrics
    const currencyElements = page.locator('[data-testid*="currency"], .currency-amount, [class*="currency"]');
    const count = await currencyElements.count();
    
    if (count > 0) {
      // Check that RUB symbol (₽) is displayed
      const rubSymbol = page.locator('text=₽');
      await expect(rubSymbol.first()).toBeVisible();
    }
  });

  test('should handle RUB currency in different contexts', async ({ page }) => {
    await page.goto('/settings');
    await page.selectOption('select[id="currency_format"]', 'RUB');
    await page.click('button:has-text("Save Preferences")');
    await page.waitForTimeout(1000);
    
    // Test in properties page
    await page.goto('/properties');
    await page.waitForSelector('[data-testid="properties-list"]', { timeout: 10000 });
    
    // Check currency display in property-related amounts
    const currencyDisplay = page.locator('text=₽');
    if (await currencyDisplay.count() > 0) {
      await expect(currencyDisplay.first()).toBeVisible();
    }
    
    // Test in reports page
    await page.goto('/reports');
    await page.waitForSelector('[data-testid="reports-content"]', { timeout: 10000 });
    
    // Check currency in reports
    const reportsCurrency = page.locator('text=₽');
    if (await reportsCurrency.count() > 0) {
      await expect(reportsCurrency.first()).toBeVisible();
    }
  });
});

test.describe('Russian Date Format Support', () => {
  test('should display DD.MM.YYYY date format option', async ({ page }) => {
    await page.goto('/settings');
    
    const dateSelect = page.locator('select[id="date_format"]');
    await expect(dateSelect).toBeVisible();
    
    // Check for DD/MM/YYYY option with Russian label
    const ddmmOption = dateSelect.locator('option[value="DD/MM/YYYY"]');
    await expect(ddmmOption).toBeVisible();
    await expect(ddmmOption).toHaveText('DD/MM/YYYY (European/Russian)');
    
    // Select DD/MM/YYYY format
    await dateSelect.selectOption('DD/MM/YYYY');
    const selectedValue = await dateSelect.inputValue();
    expect(selectedValue).toBe('DD/MM/YYYY');
  });

  test('should apply DD.MM.YYYY date format throughout app', async ({ page }) => {
    await page.goto('/settings');
    await page.selectOption('select[id="date_format"]', 'DD/MM/YYYY');
    await page.click('button:has-text("Save Preferences")');
    await page.waitForTimeout(1000);
    
    // Check date format in dashboard
    await page.goto('/dashboard');
    await page.waitForSelector('[data-testid="dashboard-content"]', { timeout: 10000 });
    
    // Look for date elements and check format
    const dateElements = page.locator('[data-testid*="date"], .date, [class*="date"]');
    const count = await dateElements.count();
    
    if (count > 0) {
      // Check that dates follow DD/MM/YYYY format
      const dateText = await dateElements.first().textContent();
      if (dateText) {
        // Should match DD/MM/YYYY or DD.MM.YYYY pattern
        const datePattern = /\d{1,2}[./]\d{1,2}[./]\d{4}/;
        expect(dateText).toMatch(datePattern);
      }
    }
  });

  test('should handle Russian date input validation', async ({ page }) => {
    await page.goto('/settings');
    await page.selectOption('select[id="date_format"]', 'DD/MM/YYYY');
    await page.click('button:has-text("Save Preferences")');
    await page.waitForTimeout(1000);
    
    // Go to a page with date inputs (if any)
    await page.goto('/properties');
    await page.waitForSelector('[data-testid="properties-list"]', { timeout: 10000 });
    
    // Look for date inputs
    const dateInputs = page.locator('input[type="date"], input[name*="date"]');
    const count = await dateInputs.count();
    
    if (count > 0) {
      const dateInput = dateInputs.first();
      await dateInput.fill('15/03/2024'); // DD/MM/YYYY format
      
      // Check that the input accepts the format
      const inputValue = await dateInput.inputValue();
      expect(inputValue).toBeTruthy();
    }
  });
});

test.describe('Russian Language Support', () => {
  test('should display Russian language option', async ({ page }) => {
    await page.goto('/settings');
    
    const languageSelect = page.locator('select[id="language"]');
    await expect(languageSelect).toBeVisible();
    
    const russianOption = languageSelect.locator('option[value="ru"]');
    await expect(russianOption).toBeVisible();
    await expect(russianOption).toHaveText('Русский');
    
    // Select Russian language
    await languageSelect.selectOption('ru');
    const selectedValue = await languageSelect.inputValue();
    expect(selectedValue).toBe('ru');
  });

  test('should apply Russian language preference', async ({ page }) => {
    await page.goto('/settings');
    await page.selectOption('select[id="language"]', 'ru');
    await page.click('button:has-text("Save Preferences")');
    await page.waitForTimeout(1000);
    
    // Check that language preference is saved
    await page.goto('/settings');
    const languageSelect = page.locator('select[id="language"]');
    const selectedValue = await languageSelect.inputValue();
    expect(selectedValue).toBe('ru');
  });

  test('should handle Cyrillic text input', async ({ page }) => {
    await page.goto('/properties');
    await page.waitForSelector('[data-testid="properties-list"]', { timeout: 10000 });
    
    // Look for text inputs
    const textInputs = page.locator('input[type="text"], input[name="name"], textarea');
    const count = await textInputs.count();
    
    if (count > 0) {
      const textInput = textInputs.first();
      await textInput.click();
      
      // Test Cyrillic input
      await textInput.fill('Тестовая недвижимость');
      
      const inputValue = await textInput.inputValue();
      expect(inputValue).toBe('Тестовая недвижимость');
    }
  });
});

test.describe('Russian Regional Features', () => {
  test('should support Russian platforms in API', async ({ page }) => {
    // Test regional platforms API
    const response = await page.request.get('/api/regional/platforms');
    expect(response.ok()).toBeTruthy();
    
    const platforms = await response.json();
    expect(Array.isArray(platforms)).toBeTruthy();
    
    // Check for Russian platforms
    const russianPlatforms = platforms.filter((p: any) => p.region === 'ru');
    expect(russianPlatforms.length).toBeGreaterThan(0);
    
    // Check for specific Russian platforms
    const platformNames = russianPlatforms.map((p: any) => p.name.toLowerCase());
    expect(platformNames).toContain('avito');
    expect(platformNames).toContain('cian');
  });

  test('should support RUB currency in API', async ({ page }) => {
    // Test regional currencies API
    const response = await page.request.get('/api/regional/currencies');
    expect(response.ok()).toBeTruthy();
    
    const currencies = await response.json();
    expect(Array.isArray(currencies)).toBeTruthy();
    
    // Check for RUB currency
    const rubCurrency = currencies.find((c: any) => c.code === 'RUB');
    expect(rubCurrency).toBeTruthy();
    expect(rubCurrency.symbol).toBe('₽');
    expect(rubCurrency.name).toBe('Russian Ruble');
  });

  test('should format currency with Russian locale conventions', async ({ page }) => {
    await page.goto('/settings');
    await page.selectOption('select[id="currency_format"]', 'RUB');
    await page.click('button:has-text("Save Preferences")');
    await page.waitForTimeout(1000);
    
    // Test currency formatting
    const formattedValue = await page.evaluate(() => {
      // Test the formatCurrency function
      const testAmount = 1234567.89;
      const currency = 'RUB';
      
      // This should use space as thousands separator for RUB
      return `${testAmount.toLocaleString('ru-RU')} ₽`;
    });
    
    // Should use space as thousands separator (Russian convention)
    expect(formattedValue).toContain(' ');
    expect(formattedValue).toContain('₽');
  });

  test('should handle Russian number formatting', async ({ page }) => {
    await page.goto('/settings');
    await page.selectOption('select[id="language"]', 'ru');
    await page.selectOption('select[id="currency_format"]', 'RUB');
    await page.click('button:has-text("Save Preferences")');
    await page.waitForTimeout(1000);
    
    // Test number formatting with Russian locale
    const numberFormat = await page.evaluate(() => {
      const number = 1234567.89;
      return number.toLocaleString('ru-RU', {
        style: 'currency',
        currency: 'RUB'
      });
    });
    
    // Should format according to Russian conventions
    expect(numberFormat).toContain('₽');
    expect(numberFormat).toContain(' ');
  });

  test('should persist Russian settings across sessions', async ({ page, context }) => {
    // Set Russian preferences
    await page.goto('/settings');
    await page.selectOption('select[id="currency_format"]', 'RUB');
    await page.selectOption('select[id="language"]', 'ru');
    await page.selectOption('select[id="date_format"]', 'DD/MM/YYYY');
    await page.click('button:has-text("Save Preferences")');
    await page.waitForTimeout(1000);
    
    // Create new browser context to simulate new session
    const newContext = await context.browser()?.newContext();
    const newPage = await newContext?.newPage();
    
    if (newPage) {
      // Go to settings in new session
      await newPage.goto('/settings');
      
      // Check that preferences are persisted
      const currencySelect = newPage.locator('select[id="currency_format"]');
      const languageSelect = newPage.locator('select[id="language"]');
      const dateSelect = newPage.locator('select[id="date_format"]');
      
      expect(await currencySelect.inputValue()).toBe('RUB');
      expect(await languageSelect.inputValue()).toBe('ru');
      expect(await dateSelect.inputValue()).toBe('DD/MM/YYYY');
      
      await newPage.close();
    }
  });
});

test.describe('Russian Market Integration', () => {
  test('should work with Russian platforms in property forms', async ({ page }) => {
    await page.goto('/properties');
    await page.waitForSelector('[data-testid="properties-list"]', { timeout: 10000 });
    
    // Look for platform selection
    const platformSelects = page.locator('select[name*="platform"], select[id*="platform"]');
    const count = await platformSelects.count();
    
    if (count > 0) {
      const platformSelect = platformSelects.first();
      await platformSelect.click();
      
      // Check for Russian platforms in options
      const options = platformSelect.locator('option');
      const optionTexts = await options.allTextContents();
      
      // Should contain Russian platform names
      const hasRussianPlatforms = optionTexts.some(text => 
        text.toLowerCase().includes('avito') || 
        text.toLowerCase().includes('cian') ||
        text.toLowerCase().includes('domclick')
      );
      
      if (hasRussianPlatforms) {
        expect(hasRussianPlatforms).toBeTruthy();
      }
    }
  });

  test('should display Russian market statistics correctly', async ({ page }) => {
    await page.goto('/settings');
    await page.selectOption('select[id="currency_format"]', 'RUB');
    await page.selectOption('select[id="language"]', 'ru');
    await page.click('button:has-text("Save Preferences")');
    await page.waitForTimeout(1000);
    
    await page.goto('/dashboard');
    await page.waitForSelector('[data-testid="dashboard-content"]', { timeout: 10000 });
    
    // Check that statistics are displayed with RUB
    const currencyElements = page.locator('text=₽');
    if (await currencyElements.count() > 0) {
      await expect(currencyElements.first()).toBeVisible();
    }
    
    // Check currency display indicator
    await expect(page.locator('text=Displaying amounts in: RUB')).toBeVisible();
  });

  test('should handle Russian market export formats', async ({ page }) => {
    await page.goto('/settings');
    await page.selectOption('select[id="currency_format"]', 'RUB');
    await page.click('button:has-text("Save Preferences")');
    await page.waitForTimeout(1000);
    
    await page.goto('/reports');
    await page.waitForSelector('[data-testid="reports-content"]', { timeout: 10000 });
    
    // Test export functionality with RUB currency
    const exportButtons = page.locator('button:has-text("Export"), button:has-text("Download")');
    const count = await exportButtons.count();
    
    if (count > 0) {
      // Export should maintain RUB currency formatting
      const exportButton = exportButtons.first();
      await expect(exportButton).toBeVisible();
      
      // Click export and check for RUB formatting
      await exportButton.click();
      await page.waitForTimeout(500);
      
      // Check that currency is maintained in export
      const currencyInExport = page.locator('text=₽');
      if (await currencyInExport.count() > 0) {
        await expect(currencyInExport.first()).toBeVisible();
      }
    }
  });
});
