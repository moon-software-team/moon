/** Dependencies */
import axios from 'axios';
import { PlexLibraries, PlexLibrary, PlexMetadata, PlexLibraryContent, PlexLibraryDetails } from '@server/types';
import { Cache, CacheOptions, minutes, hours } from '@server/utils';

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
    this.url = `http://${process.moon.config.plex.server}:${process.moon.config.plex.port}`;
    this.token = process.moon.config.plex.token;

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
      return cachedData;
    }

    // If not in cache, make the API request
    const url = `${this.url}${endpoint}?X-Plex-Token=${this.token}`;

    try {
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
   * @brief Get library details from the Plex server.
   * @param libraryKey - The library section id to get the details from
   * @param forceRefresh - If true, bypasses cache and makes fresh API call
   * @returns A promise that resolves the Plex library details
   */
  public async getLibraryDetails(libraryKey: number, forceRefresh: boolean = false): Promise<PlexLibraryDetails> {
    const endpoint = `/library/sections/${libraryKey.toString()}`;

    if (forceRefresh) {
      this.cache.delete(endpoint);
    }

    const libraryDetails = await this.request(endpoint, minutes(10));
    return (libraryDetails as { MediaContainer: PlexLibraryDetails }).MediaContainer;
  }

  /**
   * @brief Fetches metadata for a specific library.
   * @param libraryKey - The key of the library to fetch metadata for.
   * @param forceRefresh - If true, bypasses cache and makes fresh API call
   * @returns A promise that resolves to the library metadata.
   */
  public async getLibraryContent(libraryKey: number, forceRefresh: boolean = false): Promise<PlexMetadata[]> {
    const endpoint = `/library/sections/${libraryKey.toString()}/all`;

    if (forceRefresh) {
      this.cache.delete(endpoint);
    }

    // Library content might change more frequently, use shorter TTL (5 minutes)
    const contentData = await this.request(endpoint, minutes(5));
    return (contentData as PlexLibraryContent).MediaContainer.Metadata;
  }

  /**
   * @brief Fetches an image from the Plex server using a specific URI.
   * @param uri - The URI of the image to fetch.
   * @param width - The desired width of the image.
   * @param height - The desired height of the image.
   * @returns A promise that resolves to the image buffer.
   */
  public async getImageFromURI(uri: string, width: number = 240, height: number = 360) {
    const cacheKey = `image:${uri}:${width}:${height}`;

    const cachedImage = this.cache.get<Buffer>(cacheKey);
    if (cachedImage) {
      return cachedImage;
    }

    const url = `${this.url}/photo/:/transcode?width=${width}&height=${height}&minSize=1&upscale=1&url=${uri}&X-Plex-Token=${this.token}`;

    try {
      const response = await axios.get(url, {
        headers: {
          'X-Plex-Token': this.token
        },
        responseType: 'arraybuffer'
      });

      const imageBuffer = Buffer.from(response.data);

      // Store in cache with longer TTL since images don't change often (2 hours)
      this.cache.set(cacheKey, imageBuffer, hours(2));

      return imageBuffer;
    } catch (error) {
      console.error('Error fetching image from Plex:', error);
      throw error;
    }
  }

  /**
   * @brief Manually clear the cache
   */
  public clearCache(): void {
    this.cache.clear();
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
