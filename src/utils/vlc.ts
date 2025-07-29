import { ChildProcess, spawn } from 'child_process';
import {
  VLCCommand,
  VLCCliFlag,
  VLCGetterCommands,
  AudioTrack,
  VideoTrack,
  SubtitleTrack,
  BaseTrack,
  VLCStatus
} from '../types';
import { Socket } from 'net';

export class VLC {
  private child: ChildProcess | null = null;
  private socket: Socket | null = null;
  private readonly VLC_FLAGS: VLCCliFlag[];
  private readonly VLC_PATH: string;

  constructor() {
    this.VLC_PATH = this.getDefaultVLCPath();
    this.VLC_FLAGS = ['--intf=rc', '--rc-host=127.0.0.1:45003', '--extraintf=rc'];
  }

  private cleanup(): void {
    this.child = null;
    if (this.socket) {
      this.socket.destroy();
      this.socket = null;
    }
  }

  private async connectTCP(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket) {
        return resolve();
      }

      this.socket = new Socket();

      this.socket.connect(45003, '127.0.0.1', () => {
        resolve();
      });

      this.socket.on('error', (err) => {
        this.socket = null;
        reject(err);
      });
    });
  }

  private async waitForReady(): Promise<void> {
    let attemps = 0;
    const maxAttempts = 30;

    while (attemps < maxAttempts) {
      try {
        await this.connectTCP();
        return;
      } catch (err) {
        attemps++;
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    throw new Error('Failed to connect to VLC after multiple attempts');
  }

  public async open(flags: VLCCliFlag[] = [], input: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.child) {
        throw new Error('VLC is already running');
      }

      const command = [...this.VLC_FLAGS, ...flags, input];
      this.child = spawn(this.VLC_PATH, command, {
        stdio: 'pipe',
        detached: false
      });

      console.log(`Starting VLC with command:`, this.child.spawnfile, this.child.spawnargs);

      this.child.on('error', (err) => {
        this.cleanup();
        reject(err);
      });

      this.child.on('exit', () => this.cleanup());
      this.child.on('close', () => this.cleanup());

      setTimeout(() => {
        this.connectTCP()
          .then(() => this.waitForReady())
          .then(resolve)
          .catch(reject);
      }, 1000);
    });
  }

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

  private async sendCommand(command: VLCCommand): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket && this.socket.writable) {
        this.socket.write(`${command}\n`, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } else {
        reject('VLC is not running or stdin is not writable');
      }
    });
  }

  public async getResponse(command: VLCGetterCommands, pattern?: RegExp, timeout: number = 2000): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.socket.writable) {
        return reject('VLC is not running or stdin is not writable');
      }

      let buffer = '';

      const listener = (data: Buffer) => {
        buffer += data.toString();

        // Remove status change lines that can interfere with pattern matching
        buffer = buffer.replace(/status change: \([^)]+\)\r?\n/g, '');
        buffer = buffer.replace(/^VLC media player.*[\r\n]/gm, '');
        buffer = buffer.replace(/^Command Line.*[\r\n]/gm, '');

        if (pattern) {
          const match = buffer.match(pattern);
          if (match) {
            this.socket!.removeListener('data', listener);
            clearTimeout(timeoutId);

            // Return the captured group if available, otherwise the full match
            const result = match[0];

            resolve(result.trim());
          }
        } else {
          // Fallback to original logic for backward compatibility
          const prompt = '>';
          const header = 'for help.';

          const headerIndex = buffer.indexOf(header);
          if (headerIndex !== -1) {
            buffer = buffer.slice(headerIndex + header.length);
          }

          buffer = buffer.trimStart();

          if (buffer.startsWith(prompt)) {
            buffer = buffer.slice(prompt.length);
          }

          if (buffer.includes(prompt)) {
            this.socket!.removeListener('data', listener);
            clearTimeout(timeoutId);

            const split = buffer.split(prompt);
            const response = split[0].trim();

            resolve(response);
          }
        }
      };

      const timeoutId = setTimeout(() => {
        this.socket!.removeListener('data', listener);
        reject(new Error(`Timeout waiting for response to command: ${command}`));
      }, timeout);

      this.socket.on('data', listener);

      this.socket.write(`${command}\n`, (err) => {
        if (err) {
          this.socket!.removeListener('data', listener);
          clearTimeout(timeoutId);
          reject(err);
        }
      });
    });
  }

  public isOpen(): boolean {
    return this.child !== null && !this.child.killed;
  }

  public async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.child) {
        this.child.on('exit', () => {
          this.child = null;
          resolve();
        });
        this.child.kill();
      } else {
        resolve();
      }
    });
  }

  public async play(): Promise<void> {
    return this.sendCommand('play');
  }

  public async pause(): Promise<void> {
    return this.sendCommand('pause');
  }

  public async togglePause(): Promise<void> {
    return this.sendCommand('pause');
  }

  public async stop(): Promise<void> {
    return this.sendCommand('stop');
  }

  public async add(input: string): Promise<void> {
    return this.sendCommand(`add ${input}`);
  }

  public async queue(input: string): Promise<void> {
    return this.sendCommand(`enqueue ${input}`);
  }

  public async delete(x: number): Promise<void> {
    return this.sendCommand(`delete ${x}`);
  }

  public async next(): Promise<void> {
    return this.sendCommand('next');
  }

  public async previous(): Promise<void> {
    return this.sendCommand('prev');
  }

  public async repeat(isOn: boolean): Promise<void> {
    return this.sendCommand(`repeat ${isOn ? 'on' : 'off'}`);
  }

  public async loop(isOn: boolean): Promise<void> {
    return this.sendCommand(`loop ${isOn ? 'on' : 'off'}`);
  }

  public async random(isOn: boolean): Promise<void> {
    return this.sendCommand(`random ${isOn ? 'on' : 'off'}`);
  }

  public async clear(): Promise<void> {
    return this.sendCommand('clear');
  }

  public async volume(volume: number): Promise<void> {
    const min = 0;
    const max = 512;

    volume = Math.max(min, Math.min(max, volume));

    return this.sendCommand(`volume ${volume}`);
  }

  public async seek(seconds: number | string): Promise<void> {
    return this.sendCommand(`seek ${seconds}`);
  }

  public async fastForward(seconds: number): Promise<void> {
    return this.sendCommand('fastforward');
  }

  public async rewind(seconds: number): Promise<void> {
    return this.sendCommand('rewind');
  }

  public async fullscreen(isOn: boolean): Promise<void> {
    return this.sendCommand(`fullscreen ${isOn ? 'on' : 'off'}`);
  }

  public async getTime(): Promise<number> {
    return parseInt((await this.getResponse('get_time', /(\d+)/)) || '0', 10);
  }

  public async isPlaying(): Promise<boolean> {
    return (await this.getResponse('is_playing', /([01])/)) === '1';
  }

  public async getTitle(): Promise<string> {
    return (await this.getResponse('get_title', /(.+?)(?:\r?\n|$)/)) || '';
  }

  public async getLength(): Promise<number> {
    return parseInt((await this.getResponse('get_length', /(\d+)/)) || '0', 10);
  }

  public async getVolume(): Promise<number> {
    return parseInt((await this.getResponse('volume', /(\d+)/)) || '0', 10);
  }

  private async getTracks(command: VLCGetterCommands): Promise<BaseTrack[]> {
    const response = await this.getResponse(command, /\+----\[ ([^\]]+) \]\r?\n(.*?)\+----\[ end of \1 \]/s);
    const tracks: BaseTrack[] = [];

    response.split('\n').forEach((line) => {
      line = line.replace(/\r/g, '');

      const match = line.match(/\|\s*(-?\d+)\s*-\s*(.*)/);
      if (match) {
        const isSelected = line.trim().endsWith('*');
        const name = isSelected ? match[2].slice(0, -1).trim() : match[2].trim();

        tracks.push({
          id: parseInt(match[1], 10),
          name,
          selected: isSelected
        });
      }
    });

    return tracks;
  }

  public async getAudioTracks(): Promise<AudioTrack[]> {
    const tracks: AudioTrack[] = await this.getTracks('atrack');

    return tracks;
  }

  public async setAudioTrack(trackId: number): Promise<void> {
    return this.sendCommand(`atrack ${trackId}`);
  }

  public async getVideoTracks(): Promise<VideoTrack[]> {
    const tracks: VideoTrack[] = await this.getTracks('vtrack');

    return tracks;
  }

  public async setVideoTrack(trackId: number): Promise<void> {
    return this.sendCommand(`vtrack ${trackId}`);
  }

  public async getSubtitleTracks(): Promise<SubtitleTrack[]> {
    const tracks: SubtitleTrack[] = await this.getTracks('strack');

    return tracks;
  }

  public async setSubtitleTrack(trackId: number): Promise<void> {
    return this.sendCommand(`strack ${trackId}`);
  }

  public async getStatus(): Promise<VLCStatus> {
    const status: VLCStatus = {
      state: '',
      position: await this.getTime(),
      length: await this.getLength(),
      volume: await this.getVolume()
    };

    const response = await this.getResponse('status', /(.+?)(?=\r?\n\+|$)/s);

    console.log('VLC Status Response:', `\`${response}\``);

    const stateMatch = response.match(/\(\s*state\s+(\w+)\s*\)/);
    if (stateMatch) {
      status.state = stateMatch[1];
    }

    console.log('Parsed VLC Status:', status);

    return status;
  }
}

export const vlc = new VLC();
