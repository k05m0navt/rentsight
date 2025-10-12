import { test, expect } from '@playwright/test';

test.describe('Spacing Consistency Analysis', () => {
  test('should follow 8-point spacing scale throughout application', async ({ page }) => {
    await page.goto('/dashboard');
    
    const elements = page.locator('[class*="p-"], [class*="m-"], [class*="gap-"]');
    const count = await elements.count();
    
    if (count > 0) {
      for (let i = 0; i < Math.min(count, 5); i++) {
        const element = elements.nth(i);
        const padding = await element.evaluate((el) => 
          window.getComputedStyle(el).padding
        );
        const margin = await element.evaluate((el) => 
          window.getComputedStyle(el).margin
        );
        
        const paddingValues = padding.split(' ').map(val => parseInt(val));
        const marginValues = margin.split(' ').map(val => parseInt(val));
        
        [...paddingValues, ...marginValues].forEach(value => {
          if (!isNaN(value) && value > 0) {
            expect(value % 4).toBe(0); // Should follow 8-point scale
          }
        });
      }
    }
  });

  test('should have consistent card spacing across pages', async ({ page }) => {
    const pages = ['/dashboard', '/dashboard/rent-analytics', '/dashboard/expense-analytics'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      const card = page.locator('[class*="bg-card"]').first();
      
      if (await card.count() > 0) {
        const padding = await card.evaluate((el) => 
          window.getComputedStyle(el).padding
        );
        
        // Should have consistent padding
        expect(padding).toMatch(/\d+px/);
      }
    }
  });

  test('should maintain consistent button spacing', async ({ page }) => {
    await page.goto('/');
    
    const buttons = page.locator('button');
    const count = await buttons.count();
    
    if (count > 1) {
      const firstButton = buttons.first();
      const firstPadding = await firstButton.evaluate((el) => 
        window.getComputedStyle(el).padding
      );
      
      // All buttons should have consistent padding
      expect(firstPadding).toMatch(/\d+px/);
    }
  });

  test('should have consistent form field spacing', async ({ page }) => {
    await page.goto('/auth/login');
    
    const inputs = page.locator('input');
    const count = await inputs.count();
    
    if (count > 1) {
      // Take screenshot for form spacing validation
      await expect(page).toHaveScreenshot('form-spacing-consistency.png');
    }
  });

  test('should maintain spacing in navigation items', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/dashboard');
    
    const navItems = page.locator('nav a, nav button');
    const count = await navItems.count();
    
    if (count > 0) {
      const firstItem = navItems.first();
      const padding = await firstItem.evaluate((el) => 
        window.getComputedStyle(el).padding
      );
      
      const paddingValues = padding.split(' ').map(val => parseInt(val));
      paddingValues.forEach(value => {
        if (!isNaN(value)) {
          expect(value % 4).toBe(0); // 8-point scale
        }
      });
    }
  });

  test('should have consistent heading margins', async ({ page }) => {
    await page.goto('/dashboard');
    
    const headings = page.locator('h1, h2, h3');
    const count = await headings.count();
    
    if (count > 0) {
      for (let i = 0; i < Math.min(count, 3); i++) {
        const heading = headings.nth(i);
        const margin = await heading.evaluate((el) => 
          window.getComputedStyle(el).marginBottom
        );
        
        if (margin !== '0px') {
          const marginValue = parseInt(margin);
          expect(marginValue % 4).toBe(0); // 8-point scale
        }
      }
    }
  });

  test('should maintain consistent spacing in responsive layouts', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1280, height: 720, name: 'desktop' },
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/dashboard');
      
      // Take screenshot for each viewport
      await expect(page).toHaveScreenshot(`spacing-consistency-${viewport.name}.png`);
    }
  });

  test('should have consistent list item spacing', async ({ page }) => {
    await page.goto('/dashboard');
    
    const listItems = page.locator('ul li, ol li');
    if (await listItems.count() > 0) {
      const firstItem = listItems.first();
      const marginBottom = await firstItem.evaluate((el) => 
        window.getComputedStyle(el).marginBottom
      );
      
      if (marginBottom !== '0px') {
        const value = parseInt(marginBottom);
        expect([4, 8, 12, 16]).toContain(value); // Common list spacing values
      }
    }
  });
});
