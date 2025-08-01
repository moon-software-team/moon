/** Dependencies */
import { spawn, ChildProcess } from 'child_process';
import http from 'node:http';
import { VLCConfig, VLCCommand, VLCAspectRatio, VLCCliFlag, VLCStatus } from '@server/types';
import portfinder from 'portfinder';

/** Constant for VLC executable path */
const VLC_PATH =
  process.platform === 'win32'
    ? 'C:\\Program Files\\VideoLAN\\VLC\\vlc.exe'
    : process.platform === 'darwin'
    ? '/Applications/VLC.app/Contents/MacOS/VLC'
    : 'vlc';

/** Default VLC configuration */
const VLC_DEFAULT_CONFIG: VLCConfig = {
  http: {
    port: 45002,
    host: '127.0.0.1',
    password: 'moon'
  }
};

/**
 * @brief VLCPlayer class to manage VLC media player instances.
 * @description This class provides methods to control VLC media player, such as playing, pausing, and stopping media playback.
 */
export class VLCPlayer {
  private child: ChildProcess | null = null;
  private url: string;
  public status: VLCStatus | null = null;

  /**
   * @brief Constructor for VLCPlayer.
   * @description Initializes the VLCPlayer instance with a default URL.
   */
  constructor(private config: VLCConfig = VLC_DEFAULT_CONFIG) {
    this.url = `http://${config.http.host}:${config.http.port}/requests/status.json`;
  }

  public async open(media: string, flags: VLCCliFlag[] = []): Promise<void> {
    // Check if VLC is already running
    if (this.child && this.child.exitCode === null) {
      throw new Error('VLC player is already running');
    }

    // Find a available port if the configured port is in use
    const port = await portfinder.getPortPromise({ port: this.config.http.port });

    // Update the VLC url with the available port
    this.url = `http://${this.config.http.host}:${port}/requests/status.json`;

    // Construct the VLC command with the media file and flags
    const args = [
      media,
      '--intf=http',
      `--http-password=${this.config.http.password}`,
      `--http-port=${port}`,
      `--http-host=${this.config.http.host}`,
      '--no-video-title-show',
      ...flags
    ];

    console.log(`Starting VLC with args:`, this.child.spawnargs);

    // Spawn the VLC process
    this.child = spawn(VLC_PATH, args, {
      detached: false,
      stdio: 'pipe'
    });

    // Handle VLC process error
    this.child.on('error', (error) => {
      console.error(`Failed to start VLC: ${error.message}`);
    });

    // Handle VLC process exit
    this.child.on('exit', (code) => {
      console.log(`VLC process exited with code ${code}`);
      this.child = null;
    });

    // Wait for VLC to be ready
    await this.waitForVLC();
  }

  /**
   * @brief Close the VLC player.
   * @description Terminates the VLC process if it is running.
   * @example
   * const player = new VLCPlayer();
   * player.open('http://example.com/video.mp4')
   *   .then(() => console.log('VLC is ready'))
   *   .catch(error => console.error('Error:', error));
   * player.close();
   */
  public async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.child) {
        this.child.on('close', () => {
          this.child = null;
          resolve();
        });
        this.child.kill();
      } else {
        resolve();
      }
    });
  }

  /**
   * @brief Wait for VLC to start and be ready to accept requests.
   * @param maxAttempts - Maximum number of attempts to check if VLC is ready.
   * @param delay - Delay in milliseconds between attempts.
   * @returns A promise that resolves when VLC is ready.
   * @throws Error if VLC does not start successfully within the specified attempts.
   * @description This method checks if the VLC server is ready to accept requests by making repeated HTTP requests.
   * It will retry a specified number of times with a delay between attempts.
   * @example
   * const player = new VLCPlayer();
   * player.open('http://example.com/video.mp4')
   *   .then(() => console.log('VLC is ready'))
   *   .catch(error => console.error('Error:', error));
   */
  private async waitForVLC(maxAttempts: number = 20, delay: number = 1000): Promise<void> {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        // Attempt to make a request to the VLC server
        await this.request({});
        return;
      } catch (error) {
        // If the request fails, wait and try again
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    // If we reach here, it means VLC did not start successfully
    throw new Error('VLC HTTP interface timed out or failed to start');
  }

  /**
   * @brief Make a request to the VLC server.
   * @param params - The parameters to send in the request.
   * @returns A promise that resolves with the response from the VLC server.
   * @throws Error if the VLC player is not running or if the request fails.
   * @description This method sends a request to the VLC server with the specified parameters and returns the response.
   * It handles the HTTP request and response, including error handling and timeout management.
   * @example
   * const player = new VLCPlayer();
   * player.request({ command: 'in_play', input: 'http://example.com/video.mp4' })
   *   .then(response => console.log(response))
   *   .catch(error => console.error('Error:', error));
   */
  public async request<T extends any>(params: VLCCommand): Promise<T> {
    // Check if the child process is running
    if (!this.child || this.child.exitCode !== null) {
      throw new Error('VLC player is not running');
    }

    // Return a promise that resolves when the request is sent
    return new Promise((resolve, reject) => {
      // Create an HTTP request to the VLC server
      const url = new URL(this.url);

      // Add query parameters to the URL
      for (const [key, value] of Object.entries(params)) {
        // Skip undefined or null values
        if (value === undefined || value === null || value === '') {
          continue;
        }

        // Append the parameter to the URL search params
        url.searchParams.append(key, value.toString());
      }

      // Generate the authentication header
      const auth = Buffer.from(`:${this.config.http.password}`).toString('base64');

      // Set up the HTTP request options
      const options: http.RequestOptions = {
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

      // Create the HTTP request
      const request = http.request(options, (response) => {
        // Handle the response from the VLC server
        let data = '';

        // Add the chunk of data to the response
        response.on('data', (chunk) => (data += chunk));

        // Resolve the promise when the response ends
        response.on('end', () => {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (error) {
            reject(new Error(`Failed to parse JSON response: ${error}`));
          }
        });
      });

      // Handle errors in the response
      request.on('error', (error) => {
        reject(new Error(`VLC request failed: ${error.message}`));
      });

      // Handle request timeout
      request.on('timeout', () => {
        request.destroy();
        reject(new Error('VLC request timed out'));
      });

      // End the request
      request.end();
    });
  }

  /**
   * @brief Check if the VLC player is currently open.
   * @returns A boolean indicating whether the VLC player is open.
   * @description This method checks if the VLC player process is running and has not exited.
   * @example
   * const player = new VLCPlayer();
   * console.log(player.isOpen()); // true if VLC is running, false otherwise
   */
  public isOpen(): boolean {
    return this.child !== null && this.child.exitCode === null;
  }

  /**
   * @brief Get the current status of the VLC player.
   * @returns A promise that resolves with the current status of the VLC player.
   * @throws Error if the VLC player is not running or if the request fails.
   * @description This method sends a request to the VLC server to retrieve the current status,
   * including information about the currently playing media, playback state, and other details.
   * @example
   * const player = new VLCPlayer();
   * player.getStatus()
   *   .then(status => console.log('VLC Status:', status))
   *   .catch(error => console.error('Error:', error));
   */
  async getStatus(): Promise<VLCStatus> {
    this.status = await this.request<VLCStatus>({});
    return this.status;
  }

  /**
   * @brief Play a media file in VLC.
   * @param id - Optional media ID to play.
   * @returns A promise that resolves when the media starts playing.
   * @throws Error if the VLC player is not running or if the request fails.
   * @description This method sends a command to VLC to play a media file. If an ID is provided, it plays the media with that ID; otherwise, it plays the currently selected media.
   * @example
   * const player = new VLCPlayer();
   * player.play(1)
   *   .then(() => console.log('Media is playing'))
   *   .catch(error => console.error('Error:', error));
   */
  public async play(id?: number): Promise<void> {
    return this.request({ command: 'pl_play', id: id ? id.toString() : undefined });
  }

  /**
   * @brief Pause the currently playing media in VLC.
   * @param id - Optional media ID to pause.
   * @returns A promise that resolves when the media is paused.
   * @throws Error if the VLC player is not running or if the request fails.
   * @description This method sends a command to VLC to pause the currently playing media. If an ID is provided, it pauses the media with that ID; otherwise, it pauses the currently selected media.
   * @example
   * const player = new VLCPlayer();
   * player.pause(1)
   *   .then(() => console.log('Media is paused'))
   *   .catch(error => console.error('Error:', error));
   */
  public async pause(id?: number): Promise<void> {
    return this.request({ command: 'pl_pause', id: id ? id.toString() : undefined });
  }

  /**
   * @brief Stop the currently playing media in VLC.
   * @returns A promise that resolves when the media is stopped.
   * @throws Error if the VLC player is not running or if the request fails.
   * @description This method sends a command to VLC to stop the currently playing media.
   * @example
   * const player = new VLCPlayer();
   * player.stop()
   *   .then(() => console.log('Media is stopped'))
   *   .catch(error => console.error('Error:', error));
   */
  public async stop(): Promise<void> {
    return this.request({ command: 'pl_stop' });
  }

  /**
   * @brief Jump to next media in the playlist.
   * @returns A promise that resolves when the next media starts playing.
   * @throws Error if the VLC player is not running or if the request fails.
   * @description This method sends a command to VLC to jump to the next media in the playlist.
   * @example
   * const player = new VLCPlayer();
   * player.next()
   *   .then(() => console.log('Jumped to next media'))
   *   .catch(error => console.error('Error:', error));
   */
  public async next(): Promise<void> {
    return this.request({ command: 'pl_next' });
  }

  /**
   * @brief Jump to previous media in the playlist.
   * @returns A promise that resolves when the previous media starts playing.
   * @throws Error if the VLC player is not running or if the request fails.
   * @description This method sends a command to VLC to jump to the previous media in the playlist.
   * @example
   * const player = new VLCPlayer();
   * player.previous()
   *   .then(() => console.log('Jumped to previous media'))
   *   .catch(error => console.error('Error:', error));
   */
  public async previous(): Promise<void> {
    return this.request({ command: 'pl_previous' });
  }

  /**
   * @brief Force resume playback in VLC.
   * @returns A promise that resolves when playback is resumed.
   * @throws Error if the VLC player is not running or if the request fails.
   * @description This method sends a command to VLC to force resume playback, even if the media is paused.
   * @example
   * const player = new VLCPlayer();
   * player.forceResume()
   *   .then(() => console.log('Playback resumed'))
   *   .catch(error => console.error('Error:', error));
   */
  public async forceResume(): Promise<void> {
    return this.request({ command: 'pl_forceresume' });
  }

  /**
   * @brief Force pause playback in VLC.
   * @returns A promise that resolves when playback is paused.
   * @throws Error if the VLC player is not running or if the request fails.
   * @description This method sends a command to VLC to force pause playback, even if the media is playing.
   * @example
   * const player = new VLCPlayer();
   * player.forcePause()
   *   .then(() => console.log('Playback paused'))
   *   .catch(error => console.error('Error:', error));
   */
  public async forcePause(): Promise<void> {
    return this.request({ command: 'pl_forcepause' });
  }

  /**
   * @brief Enqueue a media file in VLC.
   * @param input - The media file to enqueue.
   * @returns A promise that resolves when the media is enqueued.
   * @throws Error if the VLC player is not running or if the request fails.
   * @description This method sends a command to VLC to enqueue a media file for playback.
   * @example
   * const player = new VLCPlayer();
   * player.enqueue('http://example.com/video.mp4')
   *   .then(() => console.log('Media enqueued'))
   *   .catch(error => console.error('Error:', error));
   */
  public async enqueue(input: string): Promise<void> {
    return this.request({ command: 'in_enqueue', input });
  }

  /**
   * @brief Add subtitle to the currently playing media in VLC.
   * @param input - The subtitle file to add.
   * @returns A promise that resolves when the subtitle is added.
   * @throws Error if the VLC player is not running or if the request fails.
   * @description This method sends a command to VLC to add a subtitle file to the currently playing media.
   * @example
   * const player = new VLCPlayer();
   * player.addSubtitle('http://example.com/subtitle.srt')
   *   .then(() => console.log('Subtitle added'))
   *   .catch(error => console.error('Error:', error));
   */
  public async addSubtitle(input: string): Promise<void> {
    return this.request({ command: 'addsubtitle', val: input });
  }

  /**
   * @brief Clear the VLC playlist.
   * @returns A promise that resolves when the playlist is cleared.
   * @throws Error if the VLC player is not running or if the request fails.
   * @description This method sends a command to VLC to clear the current playlist.
   * @example
   * const player = new VLCPlayer();
   * player.emptyPlaylist()
   *   .then(() => console.log('Playlist cleared'))
   *   .catch(error => console.error('Error:', error));
   */
  public async emptyPlaylist(): Promise<void> {
    return this.request({ command: 'pl_empty' });
  }

  /**
   * @brief Set the playback rate in VLC.
   * @param rate - The playback rate to set (must be greater than 0).
   * @returns A promise that resolves when the playback rate is set.
   * @throws Error if the VLC player is not running, if the request fails, or if the rate is not greater than 0.
   * @description This method sends a command to VLC to set the playback rate.
   * @example
   * const player = new VLCPlayer();
   * player.setPlaybackRate(1.5)
   *   .then(() => console.log('Playback rate set to 1.5'))
   *   .catch(error => console.error('Error:', error));
   */
  public async setPlaybackRate(rate: number): Promise<void> {
    if (rate <= 0) {
      throw new Error('Playback rate must be greater than 0');
    }
    return this.request({ command: 'rate', val: rate });
  }

  /**
   * @brief Set the aspect ratio in VLC.
   * @param aspect - The aspect ratio to set (e.g., '16:9', '4:3').
   * @returns A promise that resolves when the aspect ratio is set.
   * @throws Error if the VLC player is not running, if the request fails, or if the aspect ratio is invalid.
   * @description This method sends a command to VLC to set the aspect ratio.
   * @example
   * const player = new VLCPlayer();
   * player.setAspectRatio('16:9')
   *   .then(() => console.log('Aspect ratio set to 16:9'))
   *   .catch(error => console.error('Error:', error));
   */
  public async setAspectRatio(aspect: VLCAspectRatio): Promise<void> {
    return this.request({ command: 'aspectratio', val: aspect });
  }

  /**
   * @brief Toggle random playback in VLC.
   * @returns A promise that resolves when the random playback mode is toggled.
   * @throws Error if the VLC player is not running or if the request fails.
   * @description This method sends a command to VLC to toggle the random playback mode.
   * @example
   * const player = new VLCPlayer();
   * player.toggleRandom()
   *   .then(() => console.log('Random playback toggled'))
   *   .catch(error => console.error('Error:', error));
   */
  public async toggleRandom(): Promise<void> {
    return this.request({ command: 'pl_random' });
  }

  /**
   * @brief Toggle loop playback in VLC.
   * @returns A promise that resolves when the loop playback mode is toggled.
   * @throws Error if the VLC player is not running or if the request fails.
   * @description This method sends a command to VLC to toggle the loop playback mode.
   * @example
   * const player = new VLCPlayer();
   * player.toggleLoop()
   *   .then(() => console.log('Loop playback toggled'))
   *   .catch(error => console.error('Error:', error));
   */
  public async toggleLoop(): Promise<void> {
    return this.request({ command: 'pl_loop' });
  }

  /**
   * @brief Toggle fullscreen mode in VLC.
   * @returns A promise that resolves when the fullscreen mode is toggled.
   * @throws Error if the VLC player is not running or if the request fails.
   * @description This method sends a command to VLC to toggle fullscreen mode.
   * @example
   * const player = new VLCPlayer();
   * player.toggleFullscreen()
   *   .then(() => console.log('Fullscreen mode toggled'))
   *   .catch(error => console.error('Error:', error));
   */
  public async toggleFullscreen(): Promise<void> {
    return this.request({ command: 'fullscreen' });
  }

  /**
   * @brief Toggle repeat mode in VLC.
   * @returns A promise that resolves when the repeat mode is toggled.
   * @throws Error if the VLC player is not running or if the request fails.
   * @description This method sends a command to VLC to toggle the repeat mode.
   * @example
   * const player = new VLCPlayer();
   * player.toggleRepeat()
   *   .then(() => console.log('Repeat mode toggled'))
   *   .catch(error => console.error('Error:', error));
   */
  public async toggleRepeat(): Promise<void> {
    return this.request({ command: 'pl_repeat' });
  }

  /**
   * @brief Set the volume in VLC.
   * @param volume - The volume level to set (0-512, 100%, +5, -10%).
   * @returns A promise that resolves when the volume is set.
   * @throws Error if the VLC player is not running, if the request fails, or if the volume is out of range.
   * @description This method sends a command to VLC to set the volume level.
   * @example
   * const player = new VLCPlayer();
   * player.setVolume(256)
   *   .then(() => console.log('Volume set to 256'))
   *   .catch(error => console.error('Error:', error));
   */
  public async setVolume(volume: number | string): Promise<void> {
    return this.request({ command: 'volume', val: volume });
  }

  /**
   * @brief Seek to a specific time in VLC.
   * @param time - The time to seek to (in seconds or as a string).
   * @returns A promise that resolves when the seek operation is complete.
   * @throws Error if the VLC player is not running, if the request fails, or if the time is invalid.
   * @description This method sends a command to VLC to seek to a specific time in the currently playing media.
   * @example
   * const player = new VLCPlayer();
   * player.seek(120)
   *   .then(() => console.log('Seeked to 120 seconds'))
   *   .catch(error => console.error('Error:', error));
   */
  public async seek(time: number | string): Promise<void> {
    return this.request({ command: 'seek', val: time });
  }

  /**
   * @brief Set the preamp value in VLC.
   * @param value - The preamp value to set (-20 to 20).
   * @returns A promise that resolves when the preamp value is set.
   * @throws Error if the VLC player is not running, if the request fails, or if the value is out of range.
   * @description This method sends a command to VLC to set the preamp value, which adjusts the overall volume level.
   * @example
   * const player = new VLCPlayer();
   * player.setPreamp(10)
   *   .then(() => console.log('Preamp set to 10'))
   *   .catch(error => console.error('Error:', error));
   */
  public async setPreamp(value: number): Promise<void> {
    if (value < -20 || value > 20) {
      throw new Error('Preamp value must be between -20 and 20');
    }
    return this.request({ command: 'preamp', val: value });
  }

  /**
   * @brief Enable or disable the equalizer in VLC.
   * @param enabled - Whether to enable (true) or disable (false) the equalizer.
   * @returns A promise that resolves when the equalizer is enabled or disabled.
   * @throws Error if the VLC player is not running or if the request fails.
   * @description This method sends a command to VLC to enable or disable the equalizer.
   * @example
   * const player = new VLCPlayer();
   * player.enableEqualizer(true)
   *   .then(() => console.log('Equalizer enabled'))
   *   .catch(error => console.error('Error:', error));
   */
  public async enableEqualizer(enabled: boolean): Promise<void> {
    return this.request({ command: 'equalizer', val: enabled ? 1 : 0 });
  }

  /**
   * @brief Set the value of a specific equalizer band in VLC.
   * @param band - The band number (0-9).
   * @param value - The value to set for the band (-20 to 20).
   * @returns A promise that resolves when the band value is set.
   * @throws Error if the VLC player is not running, if the request fails, or if the band or value is out of range.
   * @description This method sends a command to VLC to set the value of a specific equalizer band.
   * @example
   * const player = new VLCPlayer();
   * player.setEqualizerBand(0, 10)
   *   .then(() => console.log('Equalizer band 0 set to 10'))
   *   .catch(error => console.error('Error:', error));
   */
  public async setEqualizerBand(band: number, value: number): Promise<void> {
    if (band < 0 || band > 9) {
      throw new Error('Band must be between 0 and 9');
    }
    if (value < -20 || value > 20) {
      throw new Error('Band value must be between -20 and 20');
    }
    return this.request({ command: 'equalizer_band', band, val: value });
  }

  /**
   * @brief Set the preset for the equalizer in VLC.
   * @param preset - The preset number (0-9).
   * @returns A promise that resolves when the preset is set.
   * @throws Error if the VLC player is not running, if the request fails, or if the preset is out of range.
   * @description This method sends a command to VLC to set the equalizer preset.
   * @example
   * const player = new VLCPlayer();
   * player.setPreset(1)
   *   .then(() => console.log('Equalizer preset set to 1'))
   *   .catch(error => console.error('Error:', error));
   */
  public async setPreset(preset: number): Promise<void> {
    if (preset < 0 || preset > 9) {
      throw new Error('Preset must be between 0 and 9');
    }
    return this.request({ command: 'setpreset', val: preset });
  }

  /**
   * @brief Select a specific title in the currently playing media in VLC.
   * @param title - The title number or name to select.
   * @returns A promise that resolves when the title is selected.
   * @throws Error if the VLC player is not running, if the request fails, or if the title is invalid.
   * @description This method sends a command to VLC to select a specific title in the currently playing media.
   * @example
   * const player = new VLCPlayer();
   * player.selectTitle(1)
   *   .then(() => console.log('Title 1 selected'))
   *   .catch(error => console.error('Error:', error));
   */
  public async selectTitle(title: number | string): Promise<void> {
    return this.request({ command: 'title', val: title });
  }

  /**
   * @brief Select a specific chapter in the currently playing media in VLC.
   * @param chapter - The chapter number or name to select.
   * @returns A promise that resolves when the chapter is selected.
   * @throws Error if the VLC player is not running, if the request fails, or if the chapter is invalid.
   * @description This method sends a command to VLC to select a specific chapter in the currently playing media.
   * @example
   * const player = new VLCPlayer();
   * player.selectChapter(1)
   *   .then(() => console.log('Chapter 1 selected'))
   *   .catch(error => console.error('Error:', error));
   */
  public async selectChapter(chapter: number | string): Promise<void> {
    return this.request({ command: 'chapter', val: chapter });
  }

  /**
   * @brief Select a specific audio track in the currently playing media in VLC.
   * @param track - The audio track number to select.
   * @returns A promise that resolves when the audio track is selected.
   * @throws Error if the VLC player is not running, if the request fails, or if the track is invalid.
   * @description This method sends a command to VLC to select a specific audio track in the currently playing media.
   * @example
   * const player = new VLCPlayer();
   * player.selectAudioTrack(1)
   *   .then(() => console.log('Audio track 1 selected'))
   *   .catch(error => console.error('Error:', error));
   */
  public async selectAudioTrack(track: number): Promise<void> {
    return this.request({ command: 'audio_track', val: track });
  }

  /**
   * @brief Select a specific video track in the currently playing media in VLC.
   * @param track - The video track number to select.
   * @returns A promise that resolves when the video track is selected.
   * @throws Error if the VLC player is not running, if the request fails, or if the track is invalid.
   * @description This method sends a command to VLC to select a specific video track in the currently playing media.
   * @example
   * const player = new VLCPlayer();
   * player.selectVideoTrack(1)
   *   .then(() => console.log('Video track 1 selected'))
   *   .catch(error => console.error('Error:', error));
   */
  public async selectVideoTrack(track: number): Promise<void> {
    return this.request({ command: 'video_track', val: track });
  }

  /**
   * @brief Select a specific subtitle track in the currently playing media in VLC.
   * @param track - The subtitle track number to select.
   * @returns A promise that resolves when the subtitle track is selected.
   * @throws Error if the VLC player is not running, if the request fails, or if the track is invalid.
   * @description This method sends a command to VLC to select a specific subtitle track in the currently playing media.
   * @example
   * const player = new VLCPlayer();
   * player.selectSubtitleTrack(1)
   *   .then(() => console.log('Subtitle track 1 selected'))
   *   .catch(error => console.error('Error:', error));
   */
  public async selectSubtitleTrack(track: number): Promise<void> {
    return this.request({ command: 'subtitle_track', val: track });
  }
}

/** Default export the VLCPlayer */
export default VLCPlayer;
