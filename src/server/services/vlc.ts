import { spawn, ChildProcess } from 'child_process';
import * as http from 'node:http';
import { VLCConfig, VLCStatus, AudioTrack, SubtitleTrack } from '../../types';
import argv from '../../config';

/**
 * @brief API class to handle all the command for VLC
 */
class VLCApi {
  private child: ChildProcess | null = null;
  private config: VLCConfig;
  private url: string;
  public title: string;

  /**
   * @brief Constructor for the VLC Api class
   * @param config The configuration of the class
   */
  constructor(config: VLCConfig) {
    this.config = {
      vlcPath: this.getDefaultVLCPath(),
      ...config
    };
    this.title = 'Inconnu';
    this.url = `http://127.0.0.1:${this.config.httpPort}`;
  }

  /**
   * @brief Get the default VLC binary path
   * @returns The path to the VLC binary
   */
  private getDefaultVLCPath(): string {
    // Default VLC paths for different platforms
    switch (process.platform) {
      case 'win32':
        return 'C:\\Program Files\\VideoLAN\\VLC\\vlc.exe';
      case 'darwin':
        return '/Applications/VLC.app/Contents/MacOS/VLC';
      case 'linux':
        return 'vlc';
      default:
        return 'vlc';
    }
  }

  /**
   * Launch VLC with a specific file in kiosk mode (fullscreen, no controls)
   */
  async openFile(filePath: string, title: string): Promise<void> {
    if (this.child) {
      await this.close();
    }

    this.title = title;

    const args = [
      filePath,
      '--intf',
      'http',
      '--http-password',
      this.config.httpPassword,
      '--http-port',
      this.config.httpPort.toString(),
      '--fullscreen',
      '--no-video-title-show',
      '--no-osd',
      '--no-playlist-tree',
      '--no-random',
      '--no-loop',
      '--no-repeat',
      '--video-on-top',
      '--no-video-deco',
      '--no-embedded-video',
      '--qt-minimal-view',
      '--qt-notification=0',
      // Kiosk mode - minimal interface
      '--extraintf',
      'dummy'
    ];

    this.child = spawn(this.config.vlcPath!, args, {
      detached: false,
      stdio: 'pipe'
    });

    this.child.on('error', (error) => {
      console.error('Failed to start VLC:', error);
    });

    this.child.on('exit', (code) => {
      this.child = null;
    });

    // Wait for VLC HTTP interface to be ready
    await this.waitForVLC();
  }

  /**
   * Wait for VLC HTTP interface to become available
   */
  private async waitForVLC(maxAttempts: number = 10, delay: number = 1000): Promise<void> {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        await this.getStatus();
        return;
      } catch (error) {
        if (i === maxAttempts - 1) {
          throw new Error('VLC HTTP interface failed to start');
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  /**
   * Wait for video to start playing
   */
  async waitForPlayback(maxAttempts: number = 10, delay: number = 500): Promise<void> {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const status = await this.getStatus();
        if (status.state === 'playing') {
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
      } catch (error) {
        if (i === maxAttempts - 1) {
          throw new Error('Video failed to start playing');
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  /**
   * Make HTTP request to VLC using Node.js built-in http module
   */
  private async makeRequest(endpoint: string, params: Record<string, any> = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = new URL(`/requests/${endpoint}`, this.url);

      // Add query parameters
      Object.keys(params).forEach((key) => {
        url.searchParams.append(key, params[key].toString());
      });

      const auth = Buffer.from(`:${this.config.httpPassword}`).toString('base64');

      const options = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      };

      const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (error) {
            reject(new Error(`Failed to parse JSON response: ${error}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`VLC request failed: ${error.message}`));
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('VLC request timed out'));
      });

      req.end();
    });
  }

  /**
   * Get current VLC status
   */
  async getStatus(): Promise<VLCStatus> {
    const data = await this.makeRequest('status.json');
    return {
      state: data.state,
      position: data.position,
      length: data.length,
      volume: data.volume,
      currentplid: data.currentplid
    };
  }

  /**
   * Play/Resume playback
   */
  async play(): Promise<void> {
    await this.makeRequest('status.json', { command: 'pl_play' });
  }

  /**
   * Pause playback
   */
  async pause(): Promise<void> {
    await this.makeRequest('status.json', { command: 'pl_pause' });
  }

  /**
   * Toggle play/pause
   */
  async togglePlayPause(): Promise<void> {
    const status = await this.getStatus();
    if (status.state === 'playing') {
      await this.pause();
    } else {
      await this.play();
    }
  }

  /**
   * Stop playback
   */
  async stop(): Promise<void> {
    await this.makeRequest('status.json', { command: 'pl_stop' });
  }

  /**
   * Seek to specific time (in seconds)
   */
  async seek(seconds: number): Promise<void> {
    await this.makeRequest('status.json', { command: 'seek', val: seconds });
  }

  /**
   * Seek by relative amount (positive or negative seconds)
   */
  async seekRelative(seconds: number): Promise<void> {
    const sign = seconds >= 0 ? '+' : '-';
    await this.makeRequest('status.json', {
      command: 'seek',
      val: `${sign}${Math.abs(seconds)}`
    });
  }

  /**
   * Seek to percentage of total length (0-100)
   */
  async seekToPercent(percent: number): Promise<void> {
    const clampedPercent = Math.max(0, Math.min(100, percent));
    await this.makeRequest('status.json', {
      command: 'seek',
      val: `${clampedPercent}%`
    });
  }

  /**
   * Set volume (0-512, where 256 is 100%)
   */
  async setVolume(volume: number): Promise<void> {
    const clampedVolume = Math.max(0, Math.min(512, volume));
    await this.makeRequest('status.json', { command: 'volume', val: clampedVolume });
  }

  /**
   * Set volume as percentage (0-200%, where 100% is normal)
   */
  async setVolumePercent(percent: number): Promise<void> {
    const volume = Math.round((percent / 100) * 256);
    await this.setVolume(volume);
  }

  /**
   * Increase volume
   */
  async volumeUp(step: number = 20): Promise<void> {
    const status = await this.getStatus();
    await this.setVolume(status.volume + step);
  }

  /**
   * Decrease volume
   */
  async volumeDown(step: number = 20): Promise<void> {
    const status = await this.getStatus();
    await this.setVolume(status.volume - step);
  }

  /**
   * Mute/unmute
   */
  async toggleMute(): Promise<void> {
    const status = await this.getStatus();
    const isMuted = status.volume === 0;
    if (isMuted) {
      await this.setVolume(256); // Set to normal volume
    } else {
      await this.setVolume(0);
    }
  }

  /**
   * Skip to next item in playlist
   */
  async next(): Promise<void> {
    await this.makeRequest('status.json', { command: 'pl_next' });
  }

  /**
   * Skip to previous item in playlist
   */
  async previous(): Promise<void> {
    await this.makeRequest('status.json', { command: 'pl_previous' });
  }

  /**
   * Add file to playlist
   */
  async addToPlaylist(filePath: string): Promise<void> {
    await this.makeRequest('status.json', {
      command: 'in_play',
      input: encodeURIComponent(filePath)
    });
  }

  /**
   * Toggle fullscreen
   */
  async toggleFullscreen(): Promise<void> {
    await this.makeRequest('status.json', { command: 'fullscreen' });
  }

  /**
   * Close VLC
   */
  async close(): Promise<void> {
    if (this.child) {
      this.child.kill('SIGTERM');

      // Wait for process to exit
      await new Promise<void>((resolve) => {
        if (this.child) {
          this.child.on('exit', () => {
            resolve();
          });
          // Force kill after 5 seconds if it doesn't exit gracefully
          setTimeout(() => {
            if (this.child && !this.child.killed) {
              this.child.kill('SIGKILL');
            }
            resolve();
          }, 5000);
        } else {
          resolve();
        }
      });

      this.child = null;
    }
  }

  /**
   * Get current time in human readable format
   */
  async getCurrentTime(): Promise<string> {
    const status = await this.getStatus();
    const currentSeconds = Math.floor(status.position * status.length);
    return this.secondsToTimeString(currentSeconds);
  }

  /**
   * Get the title of the movie
   */
  getTitle(): string {
    return this.title;
  }

  /**
   * Get total duration in human readable format
   */
  async getDuration(): Promise<string> {
    const status = await this.getStatus();
    return this.secondsToTimeString(status.length);
  }

  private secondsToTimeString(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Set audio track by ID
   */
  async setAudioTrack(trackId: number): Promise<void> {
    await this.makeRequest('status.json', {
      command: 'audio_track',
      val: trackId
    });
  }

  /**
   * Set subtitle track by ID
   */
  async setSubtitleTrack(trackId: number): Promise<void> {
    await this.makeRequest('status.json', {
      command: 'subtitle_track',
      val: trackId
    });
  }

  /**
   * Disable audio (mute completely)
   */
  async disableAudio(): Promise<void> {
    await this.makeRequest('status.json', {
      command: 'audio_track',
      val: -1
    });
  }

  /**
   * Disable subtitles
   */
  async disableSubtitles(): Promise<void> {
    await this.makeRequest('status.json', {
      command: 'subtitle_track',
      val: -1
    });
  }

  /**
   * Cycle through audio tracks
   */
  async cycleAudioTrack(): Promise<void> {
    await this.makeRequest('status.json', {
      command: 'audio_track'
    });
  }

  /**
   * Cycle through subtitle tracks
   */
  async cycleSubtitleTrack(): Promise<void> {
    await this.makeRequest('status.json', {
      command: 'subtitle_track'
    });
  }

  /**
   * Set subtitle delay (in milliseconds)
   */
  async setSubtitleDelay(delayMs: number): Promise<void> {
    await this.makeRequest('status.json', {
      command: 'subdelay',
      val: delayMs
    });
  }

  /**
   * Set audio delay (in milliseconds)
   */
  async setAudioDelay(delayMs: number): Promise<void> {
    await this.makeRequest('status.json', {
      command: 'audiodelay',
      val: delayMs
    });
  }

  isOpen(): boolean {
    return this.child != null;
  }
}

export const vlc = new VLCApi({
  httpPassword: argv['vlc-password'],
  httpPort: argv['vlc-port']
});
