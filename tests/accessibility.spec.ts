import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility tests', () => {
  const themes = ['light', 'dark'];

  for (const theme of themes) {
    test.describe(`${theme} theme`, () => {
      test.beforeEach(async ({ page }) => {
        // Set theme before each test
        await page.goto('/');
        await page.evaluate((t) => {
          localStorage.setItem('rentsight-theme', t);
          document.documentElement.classList.toggle('dark', t === 'dark');
        }, theme);
      });

      test('homepage should not have any automatically detectable accessibility issues', async ({
        page,
      }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      });

      test('login page should not have any automatically detectable accessibility issues', async ({
        page,
      }) => {
        await page.goto('/login');
        await page.waitForLoadState('networkidle');

        const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      });

      test('signup page should not have any automatically detectable accessibility issues', async ({
        page,
      }) => {
        await page.goto('/signup');
        await page.waitForLoadState('networkidle');

        const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      });

      test('dashboard page should not have any automatically detectable accessibility issues', async ({
        page,
      }) => {
        // Note: This assumes auth is handled or can be skipped in test environment
        await page.goto('/dashboard');
        await page.waitForLoadState('networkidle');

        const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      });

      test('should have WCAG AA contrast ratios (4.5:1) for text', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        const accessibilityScanResults = await new AxeBuilder({ page })
          .withTags(['wcag2aa', 'wcag21aa'])
          .analyze();

        // Filter for color contrast violations
        const contrastViolations = accessibilityScanResults.violations.filter(
          (v) => v.id === 'color-contrast'
        );

        expect(contrastViolations).toEqual([]);
      });

      test('should have sufficient contrast for primary buttons', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Check primary button contrast
        const buttons = await page.locator('button[class*="primary"]').all();
        
        if (buttons.length > 0) {
          const accessibilityScanResults = await new AxeBuilder({ page })
            .include('button[class*="primary"]')
            .withTags(['wcag2aa'])
            .analyze();

          const contrastViolations = accessibilityScanResults.violations.filter(
            (v) => v.id === 'color-contrast'
          );

          expect(contrastViolations).toEqual([]);
        }
      });
    });
  }

  test.describe('Keyboard navigation', () => {
    test('should allow tab navigation through interactive elements', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Get all interactive elements
      const focusableElements = await page.locator('a, button, input, select, textarea, [tabindex]').all();

      if (focusableElements.length > 0) {
        // Tab through first few elements
        const firstElement = focusableElements[0];
        await firstElement.focus();
        
        // Verify focus is visible
        const hasFocusRing = await page.evaluate(() => {
          const activeEl = document.activeElement;
          if (!activeEl) return false;
          const styles = window.getComputedStyle(activeEl);
          return styles.outline !== 'none' || styles.boxShadow !== 'none';
        });

        expect(hasFocusRing).toBe(true);
      }
    });

    test('should have visible focus indicators', async ({ page, context }) => {
      // Clear auth state for this test to access login page
      await context.clearCookies();
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      
      // Wait for input to be available
      await page.waitForSelector('input', { state: 'visible', timeout: 5000 });

      // Find the first input field
      const input = page.locator('input').first();
      await input.focus();

      // Check if focus ring is visible
      const focusStyles = await input.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          outline: styles.outline,
          outlineColor: styles.outlineColor,
          outlineWidth: styles.outlineWidth,
          boxShadow: styles.boxShadow,
        };
      });

      // Verify some form of focus indication exists
      const hasFocusIndication = 
        focusStyles.outline !== 'none' ||
        focusStyles.boxShadow !== 'none' ||
        focusStyles.outlineWidth !== '0px';

      expect(hasFocusIndication).toBe(true);
    });
  });

  test.describe('Screen reader support', () => {
    test('should have proper ARIA labels for navigation', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag21a'])
        .analyze();

      const ariaViolations = accessibilityScanResults.violations.filter(
        (v) => v.id.includes('aria') || v.id.includes('label')
      );

      expect(ariaViolations).toEqual([]);
    });

    test('should use semantic HTML', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check for proper semantic elements
      const hasNav = await page.locator('nav').count() > 0;
      const hasMain = await page.locator('main').count() > 0;

      expect(hasNav).toBe(true);
      expect(hasMain).toBe(true);
    });
  });
});

