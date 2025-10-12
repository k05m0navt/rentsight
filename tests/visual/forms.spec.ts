import { test, expect } from '@playwright/test';

const themes = ['light', 'dark'];

test.describe('Forms visual regression tests', () => {
  for (const theme of themes) {
    test.describe(`${theme} theme`, () => {
      test.beforeEach(async ({ page, context }) => {
        // Clear auth for tests that need to access login/signup pages
        await context.clearCookies();
        await page.goto('/');
        await page.evaluate((t) => {
          localStorage.setItem('rentsight-theme', t);
          document.documentElement.classList.toggle('dark', t === 'dark');
        }, theme);
      });

      test(`login form ${theme} theme`, async ({ page }) => {
        await page.goto('/login');
        await page.waitForLoadState('networkidle');
        
        await expect(page).toHaveScreenshot(
          `login-form-${theme}.png`,
          {
            fullPage: true,
            maxDiffPixels: 4000, // Allow for font rendering differences across browsers
          }
        );
      });

      test(`signup form ${theme} theme`, async ({ page }) => {
        await page.goto('/signup');
        await page.waitForLoadState('networkidle');
        
        await expect(page).toHaveScreenshot(
          `signup-form-${theme}.png`,
          {
            fullPage: true,
            maxDiffPixels: 4000, // Allow for font rendering differences across browsers
          }
        );
      });

      test(`form input focus state ${theme} theme`, async ({ page, context }) => {
        // Clear auth to access login page
        await context.clearCookies();
        await page.goto('/login');
        await page.waitForLoadState('networkidle');
        
        // Wait for input to be visible
        await page.waitForSelector('input', { state: 'visible', timeout: 5000 });
        
        // Focus first input
        const input = page.locator('input').first();
        await input.focus();
        await page.waitForTimeout(200); // Wait for focus animation
        
        await expect(page).toHaveScreenshot(
          `form-input-focus-${theme}.png`,
          {
            maxDiffPixels: 3000, // Allow for focus ring variations across browsers
          }
        );
      });

      test(`form input filled state ${theme} theme`, async ({ page, context }) => {
        // Clear auth to access login page
        await context.clearCookies();
        await page.goto('/login');
        await page.waitForLoadState('networkidle');
        
        // Fill inputs
        const emailInput = page.locator('input[type="email"]').first();
        const passwordInput = page.locator('input[type="password"]').first();
        
        if (await emailInput.count() > 0) {
          await emailInput.fill('test@example.com');
        }
        if (await passwordInput.count() > 0) {
          await passwordInput.fill('password123');
        }
        
        await expect(page).toHaveScreenshot(
          `form-input-filled-${theme}.png`,
          {
            fullPage: true,
            maxDiffPixels: 100,
          }
        );
      });

      test(`form error state ${theme} theme`, async ({ page, context }) => {
        // Clear auth to access login page
        await context.clearCookies();
        await page.goto('/login');
        await page.waitForLoadState('networkidle');
        
        // Submit empty form to trigger validation
        const submitButton = page.locator('button[type="submit"]').first();
        if (await submitButton.count() > 0) {
          await submitButton.click();
          await page.waitForTimeout(500); // Wait for error messages
          
          await expect(page).toHaveScreenshot(
            `form-error-state-${theme}.png`,
            {
              fullPage: true,
              maxDiffPixels: 100,
            }
          );
        }
      });

      test(`form button states ${theme} theme`, async ({ page, context }) => {
        // Clear auth to access login page
        await context.clearCookies();
        await page.goto('/login');
        await page.waitForLoadState('networkidle');
        
        const button = page.locator('button').first();
        
        // Default state
        await expect(button).toHaveScreenshot(
          `button-default-${theme}.png`,
          {
            maxDiffPixels: 50,
          }
        );
        
        // Hover state
        await button.hover();
        await page.waitForTimeout(200);
        await expect(button).toHaveScreenshot(
          `button-hover-${theme}.png`,
          {
            maxDiffPixels: 50,
          }
        );
      });
    });
  }

  test('form responsive layout - mobile', async ({ page, context }) => {
    // Clear auth to access login page
    await context.clearCookies();
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot(
      'login-form-mobile.png',
      {
        fullPage: true,
        maxDiffPixels: 100,
      }
    );
  });

  test('form responsive layout - tablet', async ({ page, context }) => {
    // Clear auth to access login page
    await context.clearCookies();
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot(
      'login-form-tablet.png',
      {
        fullPage: true,
        maxDiffPixels: 100,
      }
    );
  });
});

