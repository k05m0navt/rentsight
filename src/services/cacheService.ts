/**
 * Cache service for orchestrating cache invalidation
 * Handles both client-side and server-side cache coordination
 */

import { revalidateCache, revalidateAllCaches } from '@/lib/cache/server-cache';

/**
 * Cache invalidation patterns for different operations
 */
export const CACHE_PATTERNS = {
  // Dashboard-related caches
  DASHBOARD: /^cache:dashboard/,

  // Property-related caches
  PROPERTIES: /^cache:properties/,
  PROPERTY_DETAIL: /^cache:property:/,

  // Tag-related caches
  TAGS: /^cache:tags/,
  TAG_DETAIL: /^cache:tag:/,

  // Entry-related caches
  RENT_ENTRIES: /^cache:rent-entries/,
  EXPENSE_ENTRIES: /^cache:expense-entries/,
  ENTRY_DETAIL: /^cache:(rent|expense)-entry:/,

  // User-related caches
  USER_PREFERENCES: /^cache:user-preferences/,

  // All caches
  ALL: /^cache:/,
} as const;

/**
 * Server-side cache tags for revalidation
 */
export const CACHE_TAGS = {
  DASHBOARD: 'dashboard',
  PROPERTIES: 'properties',
  TAGS: 'tags',
  RENT_ENTRIES: 'rent-entries',
  EXPENSE_ENTRIES: 'expense-entries',
  USER_PREFERENCES: 'user-preferences',
} as const;

/**
 * Cache invalidation service
 */
export class CacheService {
  /**
   * Invalidate client-side cache by pattern
   */
  async invalidateClientCache(pattern: RegExp): Promise<void> {
    try {
      // Import client cache dynamically to avoid SSR issues
      const { clientCache } = await import('@/lib/cache/client-cache');
      clientCache.invalidatePattern(pattern);
      console.log(`Invalidated client cache pattern: ${pattern.source}`);
    } catch (error) {
      console.error('Error invalidating client cache:', error);
    }
  }

  /**
   * Invalidate server-side cache by tags
   */
  async invalidateServerCache(tags: string[]): Promise<void> {
    try {
      await revalidateCache(tags);
      console.log(`Invalidated server cache tags: ${tags.join(', ')}`);
    } catch (error) {
      console.error('Error invalidating server cache:', error);
    }
  }

  /**
   * Invalidate both client and server caches
   */
  async invalidateAll(pattern: RegExp, tags: string[]): Promise<void> {
    await Promise.all([this.invalidateClientCache(pattern), this.invalidateServerCache(tags)]);
  }

  /**
   * Clear all caches (nuclear option)
   */
  async clearAll(): Promise<void> {
    try {
      // Clear client cache
      const { clientCache } = await import('@/lib/cache/client-cache');
      clientCache.clear();

      // Revalidate all server cache tags
      await revalidateAllCaches();

      console.log('Cleared all caches');
    } catch (error) {
      console.error('Error clearing all caches:', error);
    }
  }

  /**
   * Invalidate caches after property operations
   */
  async invalidateAfterPropertyOperation(operation: 'create' | 'update' | 'delete'): Promise<void> {
    const tags = [CACHE_TAGS.PROPERTIES, CACHE_TAGS.DASHBOARD];
    await this.invalidateAll(CACHE_PATTERNS.PROPERTIES, tags);

    console.log(`Invalidated caches after property ${operation}`);
  }

  /**
   * Invalidate caches after tag operations
   */
  async invalidateAfterTagOperation(operation: 'create' | 'update' | 'delete'): Promise<void> {
    const tags = [CACHE_TAGS.TAGS, CACHE_TAGS.DASHBOARD];
    await this.invalidateAll(CACHE_PATTERNS.TAGS, tags);

    console.log(`Invalidated caches after tag ${operation}`);
  }

  /**
   * Invalidate caches after rent entry operations
   */
  async invalidateAfterRentEntryOperation(
    operation: 'create' | 'update' | 'delete',
  ): Promise<void> {
    const tags = [CACHE_TAGS.RENT_ENTRIES, CACHE_TAGS.DASHBOARD];
    await this.invalidateAll(CACHE_PATTERNS.RENT_ENTRIES, tags);

    console.log(`Invalidated caches after rent entry ${operation}`);
  }

  /**
   * Invalidate caches after expense entry operations
   */
  async invalidateAfterExpenseEntryOperation(
    operation: 'create' | 'update' | 'delete',
  ): Promise<void> {
    const tags = [CACHE_TAGS.EXPENSE_ENTRIES, CACHE_TAGS.DASHBOARD];
    await this.invalidateAll(CACHE_PATTERNS.EXPENSE_ENTRIES, tags);

    console.log(`Invalidated caches after expense entry ${operation}`);
  }

  /**
   * Invalidate caches after user preference changes
   */
  async invalidateAfterPreferenceChange(): Promise<void> {
    const tags = [CACHE_TAGS.USER_PREFERENCES];
    await this.invalidateAll(CACHE_PATTERNS.USER_PREFERENCES, tags);

    console.log('Invalidated caches after preference change');
  }

  /**
   * Get cache metrics from client and server
   */
  async getCacheMetrics(): Promise<{
    client: unknown;
    server: unknown;
  }> {
    try {
      const { clientCache } = await import('@/lib/cache/client-cache');
      const { getCacheMetrics } = await import('@/lib/cache/server-cache');

      return {
        client: clientCache.getMetadata(),
        server: getCacheMetrics(),
      };
    } catch (error) {
      console.error('Error getting cache metrics:', error);
      return { client: null, server: null };
    }
  }

  /**
   * Log cache metrics for debugging
   */
  async logCacheMetrics(): Promise<void> {
    try {
      const { clientCache } = await import('@/lib/cache/client-cache');
      clientCache.logMetrics();

      const { getCacheMetrics } = await import('@/lib/cache/server-cache');
      console.log('Server Cache Metrics:', getCacheMetrics());
    } catch (error) {
      console.error('Error logging cache metrics:', error);
    }
  }
}

// Export singleton instance
export const cacheService = new CacheService();

// Export types
export type CacheOperation = 'create' | 'update' | 'delete';
export type CachePattern = keyof typeof CACHE_PATTERNS;
export type CacheTag = keyof typeof CACHE_TAGS;
