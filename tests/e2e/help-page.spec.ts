/**
 * E2E tests for Enhanced Help Page
 * Tests improved organization, search, and app page links
 */

import { test, expect } from '@playwright/test';

test.describe('Enhanced Help Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/help');
    await page.waitForSelector('h1:has-text("Help & Support")', { timeout: 10000 });
  });

  test('help content organized into clear categories', async ({ page }) => {
    // Check that FAQ sections are properly organized by category
    const categories = await page.locator('h3').allTextContents();

    // Should have multiple categories
    expect(categories.length).toBeGreaterThan(3);

    // Check for expected categories
    const expectedCategories = [
      'Getting Started',
      'Account',
      'Properties',
      'Reports',
      'Troubleshooting',
    ];
    for (const category of expectedCategories) {
      expect(categories).toContain(category);
    }

    // Each category should have FAQs
    for (const category of expectedCategories) {
      const categorySection = page.locator(`h3:has-text("${category}")`).locator('..');
      const faqItems = categorySection.locator('[data-testid="faq-item"]');
      expect(await faqItems.count()).toBeGreaterThan(0);
    }
  });

  test('help search shows relevant results with highlights', async ({ page }) => {
    // Test search functionality
    const searchInput = page.locator('input[placeholder*="Search help"]');
    await searchInput.fill('property');

    // Wait for search results
    await page.waitForSelector('[data-testid="search-results"]', { timeout: 5000 });

    // Check that results are shown
    const results = page.locator('[data-testid="search-result"]');
    expect(await results.count()).toBeGreaterThan(0);

    // Check that search terms are highlighted
    const highlightedText = page.locator('[data-testid="highlighted-text"]');
    expect(await highlightedText.count()).toBeGreaterThan(0);

    // Test different search terms
    await searchInput.fill('rent');
    await page.waitForSelector('[data-testid="search-results"]', { timeout: 5000 });

    const rentResults = page.locator('[data-testid="search-result"]');
    expect(await rentResults.count()).toBeGreaterThan(0);
  });

  test('help articles include screenshots', async ({ page }) => {
    // Check that popular articles section has screenshots or illustrations
    const articleCards = page.locator('[data-testid="popular-article"]');
    expect(await articleCards.count()).toBeGreaterThan(0);

    // At least some articles should have images
    const articlesWithImages = page.locator('[data-testid="popular-article"] img');
    expect(await articlesWithImages.count()).toBeGreaterThan(0);
  });

  test('links to app pages open in new tabs', async ({ page }) => {
    // Find links to app pages (dashboard, properties, etc.)
    const appLinks = page.locator('a[href^="/"][target="_blank"]');
    expect(await appLinks.count()).toBeGreaterThan(0);

    // Check that they have proper rel attributes
    const linksWithRel = page.locator('a[href^="/"][rel*="noopener"]');
    expect(await linksWithRel.count()).toBeGreaterThan(0);

    // Test clicking a link opens in new tab
    const firstLink = appLinks.first();
    const href = await firstLink.getAttribute('href');
    expect(href).toMatch(/^\/(dashboard|properties|tags|reports)/);
  });

  test('FAQ answers expand smoothly', async ({ page }) => {
    // Test FAQ accordion functionality
    const faqItems = page.locator('[data-testid="faq-item"]');
    expect(await faqItems.count()).toBeGreaterThan(0);

    // Click on first FAQ
    const firstFaq = faqItems.first();
    const question = firstFaq.locator('[data-testid="faq-question"]');
    const answer = firstFaq.locator('[data-testid="faq-answer"]');

    // Initially answer should be hidden
    await expect(answer).not.toBeVisible();

    // Click to expand
    await question.click();

    // Answer should be visible with smooth animation
    await expect(answer).toBeVisible({ timeout: 1000 });

    // Click to collapse
    await question.click();

    // Answer should be hidden again
    await expect(answer).not.toBeVisible({ timeout: 1000 });
  });

  test('contact support section is prominent', async ({ page }) => {
    // Check that contact support section exists and is prominent
    const contactSection = page.locator('h2:has-text("Contact Support")');
    await expect(contactSection).toBeVisible();

    // Should have email and community options
    const emailCard = page.locator('[data-testid="email-support"]');
    const communityCard = page.locator('[data-testid="community-support"]');

    await expect(emailCard).toBeVisible();
    await expect(communityCard).toBeVisible();

    // Email should have proper mailto link
    const emailLink = emailCard.locator('a[href^="mailto:"]');
    await expect(emailLink).toBeVisible();

    // Community should have external link
    const communityLink = communityCard.locator('a[href^="http"][target="_blank"]');
    await expect(communityLink).toBeVisible();
  });

  test('search performance is fast', async ({ page }) => {
    // Test search response time
    const searchInput = page.locator('input[placeholder*="Search help"]');

    const startTime = Date.now();
    await searchInput.fill('test');
    await page.waitForSelector('[data-testid="search-results"]', { timeout: 1000 });
    const endTime = Date.now();

    // Search should complete within 1 second (1000ms)
    expect(endTime - startTime).toBeLessThan(1000);
  });

  test('help content is accessible', async ({ page }) => {
    // Check for proper heading hierarchy
    const h1 = page.locator('h1');
    const h2 = page.locator('h2');
    const h3 = page.locator('h3');

    expect(await h1.count()).toBe(1);
    expect(await h2.count()).toBeGreaterThan(0);
    expect(await h3.count()).toBeGreaterThan(0);

    // Check for alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();
    if (imageCount > 0) {
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        expect(alt).toBeTruthy();
      }
    }

    // Check that links have descriptive text
    const links = page.locator('a');
    const linkCount = await links.count();
    for (let i = 0; i < Math.min(linkCount, 10); i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      expect(text?.trim().length).toBeGreaterThan(0);
    }
  });
});
