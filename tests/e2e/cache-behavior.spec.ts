/**
 * E2E tests for cache behavior
 * Tests hybrid caching (client + server) functionality
 */

import { test, expect } from '@playwright/test';

test.describe('Cache Behavior', () => {
  test.beforeEach(async ({ page }) => {
    // Clear all caches before each test
    await page.evaluate(() => {
      localStorage.clear();
    });

    // Clear server-side caches via API
    await page.request.delete('/api/cache/invalidate');
  });

  test('dashboard data cached on repeat visit', async ({ page }) => {
    // First visit - should be cache miss
    await page.goto('/dashboard');

    // Wait for dashboard to load
    await page.waitForSelector('[data-testid="dashboard-content"]', { timeout: 10000 });

    // Check that data was cached
    const cacheData = await page.evaluate(() => {
      return localStorage.getItem('cache:dashboard');
    });

    expect(cacheData).toBeTruthy();

    // Parse cached data
    const cachedEntry = JSON.parse(cacheData!);
    expect(cachedEntry.data).toBeDefined();
    expect(cachedEntry.timestamp).toBeDefined();
    expect(cachedEntry.expiresAt).toBeGreaterThan(cachedEntry.timestamp);
  });

  test('properties appear instantly from cache', async ({ page }) => {
    // First visit to properties page
    await page.goto('/properties');
    await page.waitForSelector('[data-testid="properties-list"]', { timeout: 10000 });

    // Verify properties are cached
    const cacheData = await page.evaluate(() => {
      return localStorage.getItem('cache:properties');
    });

    expect(cacheData).toBeTruthy();

    // Second visit - should load from cache (faster)
    const startTime = Date.now();
    await page.goto('/properties');
    await page.waitForSelector('[data-testid="properties-list"]', { timeout: 5000 });
    const loadTime = Date.now() - startTime;

    // Should load much faster from cache (less than 2 seconds)
    expect(loadTime).toBeLessThan(2000);
  });

  test('cache invalidated after write operation', async ({ page }) => {
    // Load dashboard to populate cache
    await page.goto('/dashboard');
    await page.waitForSelector('[data-testid="dashboard-content"]', { timeout: 10000 });

    // Verify cache exists
    let cacheData = await page.evaluate(() => {
      return localStorage.getItem('cache:dashboard');
    });
    expect(cacheData).toBeTruthy();

    // Create a new property (write operation)
    await page.goto('/properties');
    await page.click('button:has-text("New Property")');

    // Fill out property form (simplified)
    await page.fill('input[name="name"]', 'Test Property');
    await page.fill('input[name="address"]', '123 Test St');
    await page.click('button:has-text("Save")');

    // Wait for property to be created
    await page.waitForSelector('text=Property created successfully', { timeout: 10000 });

    // Check that dashboard cache was invalidated
    cacheData = await page.evaluate(() => {
      return localStorage.getItem('cache:dashboard');
    });

    // Cache should be invalidated (null or expired)
    if (cacheData) {
      const cachedEntry = JSON.parse(cacheData);
      expect(cachedEntry.expiresAt).toBeLessThan(Date.now());
    }

    // Navigate back to dashboard - should reload data
    await page.goto('/dashboard');
    await page.waitForSelector('[data-testid="dashboard-content"]', { timeout: 10000 });

    // Verify new cache entry was created
    cacheData = await page.evaluate(() => {
      return localStorage.getItem('cache:dashboard');
    });
    expect(cacheData).toBeTruthy();
  });

  test('stale cache not served beyond 5 minutes', async ({ page }) => {
    // Load dashboard and cache it
    await page.goto('/dashboard');
    await page.waitForSelector('[data-testid="dashboard-content"]', { timeout: 10000 });

    // Manually expire the cache by setting expiresAt to past
    await page.evaluate(() => {
      const cacheData = localStorage.getItem('cache:dashboard');
      if (cacheData) {
        const entry = JSON.parse(cacheData);
        entry.expiresAt = Date.now() - 1000; // Expired 1 second ago
        localStorage.setItem('cache:dashboard', JSON.stringify(entry));
      }
    });

    // Reload dashboard - should fetch fresh data
    await page.reload();
    await page.waitForSelector('[data-testid="dashboard-content"]', { timeout: 10000 });

    // Verify new cache entry with future expiration
    const cacheData = await page.evaluate(() => {
      return localStorage.getItem('cache:dashboard');
    });

    expect(cacheData).toBeTruthy();
    const cachedEntry = JSON.parse(cacheData!);
    expect(cachedEntry.expiresAt).toBeGreaterThan(Date.now());
  });

  test('cache hit rate ≥60% on repeat visits', async ({ page }) => {
    const pages = ['/dashboard', '/properties', '/tags'];
    const visits = 10;
    let totalVisits = 0;
    let cacheHits = 0;

    for (let i = 0; i < visits; i++) {
      for (const pagePath of pages) {
        totalVisits++;

        // Visit page
        await page.goto(pagePath);

        // Wait for content to load
        const selector =
          pagePath === '/dashboard'
            ? '[data-testid="dashboard-content"]'
            : pagePath === '/properties'
              ? '[data-testid="properties-list"]'
              : '[data-testid="tags-list"]';

        await page.waitForSelector(selector, { timeout: 10000 });

        // Check if data was served from cache (second+ visits)
        if (i > 0) {
          const cacheKey = pagePath.replace('/', '');
          const cacheData = await page.evaluate((key) => {
            return localStorage.getItem(`cache:${key}`);
          }, cacheKey);

          if (cacheData) {
            const entry = JSON.parse(cacheData);
            // If cache entry exists and is not expired, count as hit
            if (entry.expiresAt > Date.now()) {
              cacheHits++;
            }
          }
        }

        // Small delay between visits
        await page.waitForTimeout(100);
      }
    }

    const hitRate = cacheHits / (totalVisits - pages.length); // Subtract initial visits
    console.log(
      `Cache hit rate: ${(hitRate * 100).toFixed(1)}% (${cacheHits}/${totalVisits - pages.length})`,
    );

    // Should achieve at least 60% hit rate on repeat visits
    expect(hitRate).toBeGreaterThanOrEqual(0.6);
  });

  test('cache metrics are tracked correctly', async ({ page }) => {
    // Visit dashboard multiple times
    for (let i = 0; i < 3; i++) {
      await page.goto('/dashboard');
      await page.waitForSelector('[data-testid="dashboard-content"]', { timeout: 10000 });
      await page.waitForTimeout(500);
    }

    // Check cache metrics via API
    const response = await page.request.get('/api/cache/invalidate');
    expect(response.ok()).toBeTruthy();

    const metrics = await response.json();
    expect(metrics.status).toBe('healthy');
    expect(metrics.metrics).toBeDefined();
    expect(metrics.metrics.client).toBeDefined();
    expect(metrics.metrics.server).toBeDefined();
  });

  test('cache invalidation API works correctly', async ({ page }) => {
    // Load some data to cache
    await page.goto('/dashboard');
    await page.waitForSelector('[data-testid="dashboard-content"]', { timeout: 10000 });

    // Verify cache exists
    let cacheData = await page.evaluate(() => {
      return localStorage.getItem('cache:dashboard');
    });
    expect(cacheData).toBeTruthy();

    // Call invalidation API
    const response = await page.request.post('/api/cache/invalidate', {
      data: {
        operation: {
          type: 'property',
          action: 'create',
        },
      },
    });

    expect(response.ok()).toBeTruthy();
    const result = await response.json();
    expect(result.message).toContain('invalidated');

    // Check that cache was invalidated
    cacheData = await page.evaluate(() => {
      return localStorage.getItem('cache:dashboard');
    });

    // Cache should be invalidated
    if (cacheData) {
      const cachedEntry = JSON.parse(cacheData);
      expect(cachedEntry.expiresAt).toBeLessThan(Date.now());
    }
  });
});
