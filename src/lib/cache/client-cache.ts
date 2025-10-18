/**
 * Client-side cache utility using localStorage
 * Provides caching with TTL, LRU eviction, and type safety
 */

import { CacheEntry, CacheMetadata } from '@/types/cache';

const CACHE_PREFIX = 'cache:';
const MAX_ENTRIES = 50;
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

class ClientCache {
  private metrics = {
    hits: 0,
    misses: 0,
    evictions: 0,
    lastCleanup: 0,
  };

  /**
   * Get cached data by key
   */
  get<T>(key: string): T | null {
    try {
      const fullKey = CACHE_PREFIX + key;
      const cached = localStorage.getItem(fullKey);

      if (!cached) {
        this.metrics.misses++;
        return null;
      }

      const entry: CacheEntry<T> = JSON.parse(cached);

      // Check if expired
      if (Date.now() > entry.expiresAt) {
        localStorage.removeItem(fullKey);
        this.metrics.misses++;
        return null;
      }

      // Update access metadata
      entry.hitCount = (entry.hitCount || 0) + 1;
      entry.lastAccess = Date.now();
      localStorage.setItem(fullKey, JSON.stringify(entry));

      this.metrics.hits++;
      return entry.data;
    } catch (error) {
      console.warn('Cache get error:', error);
      this.metrics.misses++;
      return null;
    }
  }

  /**
   * Set cached data with TTL
   */
  set<T>(key: string, data: T, ttl: number = DEFAULT_TTL): void {
    try {
      const fullKey = CACHE_PREFIX + key;
      const now = Date.now();

      const entry: CacheEntry<T> = {
        key: fullKey,
        data,
        timestamp: now,
        expiresAt: now + ttl,
        hitCount: 0,
        lastAccess: now,
        version: '1.0',
      };

      // Check if we need to evict entries
      this.ensureSpaceAvailable();

      localStorage.setItem(fullKey, JSON.stringify(entry));

      // Periodic cleanup
      if (now - this.metrics.lastCleanup > 60000) {
        // Every minute
        this.cleanup();
      }
    } catch (error) {
      console.warn('Cache set error:', error);
    }
  }

  /**
   * Invalidate specific cache entry
   */
  invalidate(key: string): void {
    try {
      const fullKey = CACHE_PREFIX + key;
      localStorage.removeItem(fullKey);
    } catch (error) {
      console.warn('Cache invalidate error:', error);
    }
  }

  /**
   * Invalidate cache entries matching pattern
   */
  invalidatePattern(pattern: RegExp): void {
    try {
      const keysToRemove: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(CACHE_PREFIX) && pattern.test(key)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.warn('Cache invalidatePattern error:', error);
    }
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    try {
      const keysToRemove: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(CACHE_PREFIX)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.warn('Cache clear error:', error);
    }
  }

  /**
   * Get cache metadata and statistics
   */
  getMetadata(): CacheMetadata {
    const entries = this.getAllEntries();
    const totalSize = this.calculateSize(entries);
    const hitRate = this.metrics.hits / (this.metrics.hits + this.metrics.misses) || 0;

    return {
      totalEntries: entries.length,
      totalSize,
      hitRate,
      lastCleanup: this.metrics.lastCleanup,
    };
  }

  /**
   * Get all cache entries (for debugging)
   */
  private getAllEntries(): CacheEntry[] {
    const entries: CacheEntry[] = [];

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(CACHE_PREFIX)) {
          const cached = localStorage.getItem(key);
          if (cached) {
            entries.push(JSON.parse(cached));
          }
        }
      }
    } catch (error) {
      console.warn('Error getting all entries:', error);
    }

    return entries;
  }

  /**
   * Calculate approximate size of cache entries
   */
  private calculateSize(entries: CacheEntry[]): number {
    return entries.reduce((total, entry) => {
      return total + JSON.stringify(entry).length * 2; // Approximate bytes
    }, 0);
  }

  /**
   * Ensure space is available for new entry
   */
  private ensureSpaceAvailable(): void {
    const entries = this.getAllEntries();

    // Check entry count limit
    if (entries.length >= MAX_ENTRIES) {
      this.evictLRU();
    }

    // Check size limit
    if (this.calculateSize(entries) >= MAX_SIZE_BYTES) {
      this.evictLRU();
    }
  }

  /**
   * Evict least recently used entry
   */
  private evictLRU(): void {
    try {
      const entries = this.getAllEntries();

      if (entries.length === 0) return;

      // Sort by last access time (oldest first)
      entries.sort((a, b) => (a.lastAccess || 0) - (b.lastAccess || 0));

      // Remove oldest entry
      const oldestEntry = entries[0];
      localStorage.removeItem(oldestEntry.key);
      this.metrics.evictions++;
    } catch (error) {
      console.warn('LRU eviction error:', error);
    }
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    try {
      const now = Date.now();
      const expiredKeys: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(CACHE_PREFIX)) {
          const cached = localStorage.getItem(key);
          if (cached) {
            const entry: CacheEntry = JSON.parse(cached);
            if (now > entry.expiresAt) {
              expiredKeys.push(key);
            }
          }
        }
      }

      expiredKeys.forEach((key) => localStorage.removeItem(key));
      this.metrics.lastCleanup = now;
    } catch (error) {
      console.warn('Cache cleanup error:', error);
    }
  }

  /**
   * Log cache metrics (for debugging)
   */
  logMetrics(): void {
    const metadata = this.getMetadata();
    console.log('Cache Metrics:', {
      ...this.metrics,
      ...metadata,
      hitRatePercent: (metadata.hitRate * 100).toFixed(1) + '%',
    });
  }
}

// Export singleton instance
export const clientCache = new ClientCache();

// Export class for testing
export { ClientCache };
