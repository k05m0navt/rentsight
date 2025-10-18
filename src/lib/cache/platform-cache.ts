/**
 * Platform Cache
 *
 * Implements caching for platform lists to optimize performance
 */

import { getAllUserPlatforms } from '@/lib/services/platformService';

interface CacheEntry {
  data: unknown;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class PlatformCache {
  private cache = new Map<string, CacheEntry>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Get cached data if it exists and is not expired
   */
  get(key: string): unknown | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set cached data with TTL
   */
  set(key: string, data: unknown, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Invalidate cache entry
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Invalidate all cache entries for a user
   */
  invalidateUser(userId: string): void {
    const keysToDelete: string[] = [];
    for (const key of this.cache.keys()) {
      if (key.includes(userId)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach((key) => this.cache.delete(key));
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }
}

// Singleton instance
const platformCache = new PlatformCache();

/**
 * Get user platforms with caching
 */
export async function getCachedUserPlatforms(userId: string) {
  const cacheKey = `user_platforms_${userId}`;

  // Try to get from cache first
  const cached = platformCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch from database
  const platforms = await getAllUserPlatforms(userId);

  // Cache the result
  platformCache.set(cacheKey, platforms);

  return platforms;
}

/**
 * Invalidate user platform cache
 */
export function invalidateUserPlatformCache(userId: string) {
  platformCache.invalidateUser(userId);
}

/**
 * Clear all platform cache
 */
export function clearPlatformCache() {
  platformCache.clear();
}

export default platformCache;
