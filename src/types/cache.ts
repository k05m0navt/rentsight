/**
 * Cache Type Definitions
 *
 * Defines types for hybrid caching architecture (client + server)
 */

export interface CacheEntry<T = unknown> {
  /** Unique cache key (namespaced) */
  key: string;

  /** Cached data (generic type) */
  data: T;

  /** Timestamp when cached (Unix milliseconds) */
  timestamp: number;

  /** Expiration timestamp (Unix milliseconds) */
  expiresAt: number;

  /** Number of times accessed */
  hitCount?: number;

  /** Last access timestamp */
  lastAccess?: number;

  /** Version for cache busting */
  version?: string;
}

export interface CacheMetadata {
  /** Total entries in cache */
  totalEntries: number;

  /** Total size in bytes (approximate) */
  totalSize: number;

  /** Cache hit rate (0-1) */
  hitRate: number;

  /** Last cleanup timestamp */
  lastCleanup: number;
}

/**
 * Cache storage structure in localStorage
 * Key format: "cache:{resource}"
 * Value: JSON.stringify(CacheEntry)
 */
export type CacheStorage = Record<string, CacheEntry>;

/**
 * Cache invalidation patterns
 */
export type CachePattern = string | RegExp;

/**
 * Cache layer types
 */
export type CacheLayer = 'client' | 'server' | 'both';
