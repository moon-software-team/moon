import axios from 'axios';
import { PlexLibraries, PlexLibrary, PlexMetadata, PlexLibraryContent } from '../../types';

class PlexAPI {
  private url: string;
  private token: string;

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
   * @brief Fetches the plex server.
   * @returns A promise that resolves to the plex server information.
   */
  private async request(endpoint: string): Promise<any> {
    const url = `${this.url}${endpoint}?X-Plex-Token=${this.token}`;

    try {
      const response = await axios.get(url, {
        headers: {
          'X-Plex-Token': this.token,
          'Accept': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching data from Plex:', error);
      throw error;
    }
  }

  /**
   * @brief Fetches all libraries from the Plex server.
   * @returns A promise that resolves to the Plex libraries.
   */
  public async getAllLibraries(): Promise<PlexLibrary[]> {
    return ((await this.request('/library/sections')) as PlexLibraries).MediaContainer.Directory;
  }

  /**
   * @brief Fetches metadata for a specific library.
   * @param libraryKey - The key of the library to fetch metadata for.
   */
  public async getLibraryContent(libraryKey: string): Promise<PlexMetadata[]> {
    return ((await this.request(`/library/sections/${libraryKey}/all`)) as PlexLibraryContent).MediaContainer.Metadata;
  }
}

export const plex = new PlexAPI();
