/**
 * Server-side cache utilities using React cache() and Next.js unstable_cache()
 * Provides request-scoped and cross-request caching
 */

import { cache } from 'react';
import { unstable_cache } from 'next/cache';

/**
 * Request-scoped cache using React cache()
 * Data is memoized within a single request
 * Useful for expensive computations or API calls within the same request
 */
export function createRequestCache<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  keyPrefix?: string,
) {
  return cache(async (...args: T): Promise<R> => {
    const startTime = Date.now();
    try {
      const result = await fn(...args);
      const duration = Date.now() - startTime;
      console.log(`Cache miss for ${keyPrefix || 'request'}: ${duration}ms`);
      return result;
    } catch (error) {
      console.error(`Cache error for ${keyPrefix || 'request'}:`, error);
      throw error;
    }
  });
}

/**
 * Cross-request cache using Next.js unstable_cache()
 * Data is cached across multiple requests for the specified duration
 * Useful for expensive database queries or external API calls
 */
export function createCrossRequestCache<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  cacheKey: string,
  tags: string[] = [],
  revalidate: number = 300, // 5 minutes default
) {
  return unstable_cache(
    async (...args: T): Promise<R> => {
      const startTime = Date.now();
      try {
        const result = await fn(...args);
        const duration = Date.now() - startTime;
        console.log(`Cache miss for ${cacheKey}: ${duration}ms`);
        return result;
      } catch (error) {
        console.error(`Cache error for ${cacheKey}:`, error);
        throw error;
      }
    },
    [cacheKey, ...tags],
    { revalidate },
  );
}

/**
 * Dashboard data cache
 * Caches dashboard statistics and summary data
 */
export const getCachedDashboard = createCrossRequestCache(
  async () => {
    // This would typically call your dashboard service
    // For now, we'll return a placeholder
    return {
      totalProperties: 0,
      totalRentEntries: 0,
      totalExpenseEntries: 0,
      monthlyIncome: 0,
      monthlyExpenses: 0,
      lastUpdated: new Date().toISOString(),
    };
  },
  'dashboard',
  ['dashboard'],
  300, // 5 minutes
);

/**
 * Properties list cache
 * Caches the user's properties list
 */
export const getCachedProperties = createCrossRequestCache(
  async () => {
    // This would typically call your property service
    // For now, we'll return a placeholder
    return [];
  },
  'properties',
  ['properties'],
  300, // 5 minutes
);

/**
 * Tags list cache
 * Caches the user's tags list
 */
export const getCachedTags = createCrossRequestCache(
  async () => {
    // This would typically call your tag service
    // For now, we'll return a placeholder
    return [];
  },
  'tags',
  ['tags'],
  300, // 5 minutes
);

/**
 * User preferences cache
 * Caches user preferences (theme, currency, etc.)
 */
export const getCachedUserPreferences = createRequestCache(async () => {
  // This would typically call your user service
  // For now, we'll return default preferences
  return {
    theme: 'system',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: 'en-US',
    reducedMotion: false,
    preferredPlatforms: [],
  };
}, 'user-preferences');

/**
 * Cache invalidation utilities
 */
export async function revalidateCache(tags: string[]) {
  try {
    const { revalidateTag } = await import('next/cache');

    // Revalidate each tag
    for (const tag of tags) {
      revalidateTag(tag);
      console.log(`Revalidated cache tag: ${tag}`);
    }
  } catch (error) {
    console.error('Error revalidating cache:', error);
  }
}

/**
 * Revalidate all caches
 */
export async function revalidateAllCaches() {
  const allTags = ['dashboard', 'properties', 'tags', 'rent-entries', 'expense-entries'];
  await revalidateCache(allTags);
}

/**
 * Cache metrics for monitoring
 */
export interface CacheMetrics {
  hitRate: number;
  totalRequests: number;
  cacheHits: number;
  cacheMisses: number;
  averageResponseTime: number;
}

// Simple in-memory metrics (in production, you might want to use Redis or similar)
const cacheMetrics: CacheMetrics = {
  hitRate: 0,
  totalRequests: 0,
  cacheHits: 0,
  cacheMisses: 0,
  averageResponseTime: 0,
};

export function getCacheMetrics(): CacheMetrics {
  return { ...cacheMetrics };
}

export function updateCacheMetrics(hit: boolean, responseTime: number) {
  cacheMetrics.totalRequests++;
  if (hit) {
    cacheMetrics.cacheHits++;
  } else {
    cacheMetrics.cacheMisses++;
  }

  cacheMetrics.hitRate = cacheMetrics.cacheHits / cacheMetrics.totalRequests;

  // Simple moving average for response time
  const alpha = 0.1; // Smoothing factor
  cacheMetrics.averageResponseTime =
    alpha * responseTime + (1 - alpha) * cacheMetrics.averageResponseTime;
}

/**
 * Cache warming utilities
 * Pre-populate frequently accessed data
 */
export async function warmCache(userId: string) {
  try {
    console.log(`Warming cache for user: ${userId}`);

    // Pre-load commonly accessed data
    await Promise.allSettled([
      getCachedDashboard(),
      getCachedProperties(),
      getCachedTags(),
      getCachedUserPreferences(),
    ]);

    console.log(`Cache warmed for user: ${userId}`);
  } catch (error) {
    console.error('Error warming cache:', error);
  }
}
