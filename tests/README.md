# Testing

This directory contains automated tests for the Rentsight application.

## Test Types

### Accessibility Tests

Located in `accessibility.spec.ts`, these tests use [Playwright](https://playwright.dev/) and [@axe-core/playwright](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright) to automatically detect accessibility issues.

The tests check key pages:
- Homepage (`/`)
- Login page (`/login`)
- Signup page (`/signup`)

## Running Tests

### Prerequisites

First, install the Playwright browsers:

```bash
npx playwright install chromium
```

### Running Tests Locally

Run all accessibility tests:
```bash
npm run test:accessibility
```

Run all end-to-end tests:
```bash
npm run test:e2e
```

Run tests with interactive UI:
```bash
npm run test:e2e:ui
```

### Continuous Integration

Tests run automatically in GitHub Actions on:
- Pull requests to `main` or `develop`
- Direct pushes to `main` or `develop`

The accessibility tests are configured with `continue-on-error: true`, meaning they won't block PRs from merging but will report issues for review.

## Writing New Tests

### Accessibility Tests

When adding new pages, add corresponding accessibility tests:

```typescript
test('new page should not have accessibility issues', async ({ page }) => {
  await page.goto('/new-page');
  
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

### General E2E Tests

Create new test files with the `.spec.ts` extension in this directory:

```typescript
import { test, expect } from '@playwright/test';

test('describe your test', async ({ page }) => {
  await page.goto('/your-page');
  
  // Your test logic here
  await expect(page).toHaveTitle(/Expected Title/);
});
```

## Test Reports

After running tests, view the HTML report:

```bash
npx playwright show-report
```

In CI, test reports are uploaded as artifacts and can be downloaded from the GitHub Actions run page.

## Configuration

Test configuration is in `playwright.config.ts` at the project root.

Key settings:
- **Base URL**: `http://localhost:3000` (configurable via `BASE_URL` env var)
- **Projects**: accessibility, chromium, firefox, webkit
- **Retries**: 2 retries on CI, 0 locally
- **Workers**: 1 on CI, parallel locally

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Axe Accessibility Testing](https://github.com/dequelabs/axe-core)
- [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)

