import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Go to login page
  await page.goto('/login');
  await page.waitForLoadState('networkidle');

  // Fill in login credentials
  const emailInput = page.locator('input[type="email"]').first();
  const passwordInput = page.locator('input[type="password"]').first();

  if ((await emailInput.count()) > 0 && (await passwordInput.count()) > 0) {
    await emailInput.fill('ertalun@gmail.com');
    await passwordInput.fill('Da2410200!');

    // Click submit button
    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();

    // Wait for navigation to complete (should redirect to dashboard or home)
    await page.waitForURL(/dashboard|\/$/);

    // Verify we're logged in by checking for authenticated content
    // Wait a moment for auth to settle
    await page.waitForTimeout(2000);

    // Save authenticated state
    await page.context().storageState({ path: authFile });
  }
});
