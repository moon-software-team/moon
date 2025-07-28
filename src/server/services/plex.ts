import axios from 'axios';
import { PlexLibraries, PlexLibrary, PlexMetadata, PlexLibraryContent } from '../../types';
import { Cache, CacheOptions } from '../utils';
import { minutes } from '../utils';

class PlexAPI {
  private url: string;
  private token: string;
  private cache: Cache;

  /**
   * @brief Plex API constructor
   */
  constructor(cacheOptions?: CacheOptions) {
    this.cache = new Cache(cacheOptions);
  }

  /**
   * @brief Initializes the PlexAPI service.
   */
  init(): void {
    this.url = `http://${process.moonConfig.plex.server}:${process.moonConfig.plex.port}`;
    this.token = process.moonConfig.plex.token;

    if (!this.url || !this.token) {
      throw new Error('Plex server URL or token is not configured.');
    }
  }

  /**
   * @brief Fetches data from the plex server with caching support.
   * @param endpoint - The API endpoint to request
   * @param ttl - Optional custom TTL for this request in milliseconds
   * @returns A promise that resolves to the API response data.
   */
  private async request(endpoint: string, ttl?: number): Promise<any> {
    const cacheKey = `${endpoint}`;

    // Try to get from cache first
    const cachedData = this.cache.get(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for endpoint: ${endpoint}`);
      return cachedData;
    }

    // If not in cache, make the API request
    const url = `${this.url}${endpoint}?X-Plex-Token=${this.token}`;

    try {
      console.log(`Making API request to: ${endpoint}`);
      const response = await axios.get(url, {
        headers: {
          'X-Plex-Token': this.token,
          'Accept': 'application/json'
        }
      });

      // Store in cache
      this.cache.set(cacheKey, response.data, ttl);

      return response.data;
    } catch (error) {
      console.error('Error fetching data from Plex:', error);
      throw error;
    }
  }

  /**
   * @brief Fetches all libraries from the Plex server.
   * @param forceRefresh - If true, bypasses cache and makes fresh API call
   * @returns A promise that resolves to the Plex libraries.
   */
  public async getAllLibraries(forceRefresh: boolean = false): Promise<PlexLibrary[]> {
    if (forceRefresh) {
      this.cache.delete('/library/sections');
    }

    // Libraries don't change often, so use longer TTL (30 minutes)
    const librariesData = await this.request('/library/sections', minutes(30));
    return (librariesData as PlexLibraries).MediaContainer.Directory;
  }

  /**
   * @brief Fetches metadata for a specific library.
   * @param libraryKey - The key of the library to fetch metadata for.
   * @param forceRefresh - If true, bypasses cache and makes fresh API call
   * @returns A promise that resolves to the library metadata.
   */
  public async getLibraryContent(libraryKey: string, forceRefresh: boolean = false): Promise<PlexMetadata[]> {
    const endpoint = `/library/sections/${libraryKey}/all`;

    if (forceRefresh) {
      this.cache.delete(endpoint);
    }

    // Library content might change more frequently, use shorter TTL (10 minutes)
    const contentData = await this.request(endpoint, 10 * 60 * 1000);
    return (contentData as PlexLibraryContent).MediaContainer.Metadata;
  }

  /**
   * @brief Manually clear the cache
   */
  public clearCache(): void {
    this.cache.clear();
    console.log('Plex API cache cleared');
  }

  /**
   * @brief Get cache statistics
   */
  public getCacheStats() {
    return this.cache.getStats();
  }

  /**
   * @brief Remove specific cache entry
   */
  public removeCacheEntry(endpoint: string): boolean {
    return this.cache.delete(endpoint);
  }
}

export const plex = new PlexAPI({
  ttl: minutes(5),
  maxSize: 50
});
