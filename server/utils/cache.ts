import { CacheEntry, CacheOptions } from '@/server/types/cache';
import { minutes } from './time';

export class Cache {
  private cache = new Map<string, CacheEntry>();
  private defaultTTL: number;
  private maxSize: number;

  /**
   * @brief Creates a new Cache instance with the specified options.
   * @param options - Configuration options for the cache including TTL and max size
   */
  constructor(options: CacheOptions = {}) {
    this.defaultTTL = options.ttl || minutes(5);
    this.maxSize = options.maxSize || 100;
  }

  /**
   * @brief Checks if a cache entry has expired based on its timestamp and TTL.
   * @param entry - The cache entry to check for expiration
   * @returns True if the entry has expired, false otherwise
   */
  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  /**
   * @brief Removes the oldest entry from the cache when max size is reached.
   */
  private evictOldest(): void {
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
  }

  /**
   * @brief Retrieves a cached value by key, checking for expiration.
   * @param key - The cache key to retrieve the value for
   * @returns The cached data if found and not expired, null otherwise
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * @brief Stores a value in the cache with the specified key and optional TTL.
   * @param key - The cache key to store the value under
   * @param data - The data to cache
   * @param ttl - Optional time-to-live in milliseconds, uses default if not provided
   */
  set<T>(key: string, data: T, ttl?: number): void {
    this.evictOldest();

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    });
  }

  /**
   * @brief Removes a specific entry from the cache by key.
   * @param key - The cache key to remove
   * @returns True if the entry was successfully deleted, false if it didn't exist
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * @brief Removes all entries from the cache.
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * @brief Retrieves statistics about the current cache state.
   * @returns An object containing cache size, max size, and default TTL
   */
  // Get cache statistics
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      defaultTTL: this.defaultTTL
    };
  }
}

export { CacheEntry, CacheOptions };
