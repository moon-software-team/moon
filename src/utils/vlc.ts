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
import { getDefaultVLCPath } from '../server/utils/vlc';

export class VLC {
  private child: ChildProcess | null = null;
  private readonly VLC_FLAGS: VLCCliFlag[];
  private readonly VLC_PATH: string;

  constructor() {
    this.VLC_PATH = getDefaultVLCPath();
    this.VLC_FLAGS = ['--intf=rc'];
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
        this.child = null;
        reject(err);
      });

      this.child.on('exit', (code) => {
        this.child = null;
      });

      this.child.on('close', (code) => {
        this.child = null;
      });

      this.child.stdout.on('data', async (data) => {
        if (
          data.includes('Remote control interface initialized') ||
          data.includes('>') ||
          data.includes('rc interface')
        ) {
          this.child.stdout.removeAllListeners('data');
          while (!(await this.isPlaying())) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
          resolve();
        }
      });

      setTimeout(() => {
        reject(new Error('Timeout waiting for VLC to start'));
      }, 3000);
    });
  }

  private async sendCommand(command: VLCCommand): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.child && this.child.stdin.writable) {
        this.child.stdin.write(`${command}\n`, (err) => {
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

  public async getResponse(command: VLCGetterCommands): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.child || !this.child.stdin.writable) {
        return reject('VLC is not running or stdin is not writable');
      }

      let buffer = '';
      const prompt = '>';

      const listener = (data: Buffer) => {
        buffer += data.toString();

        if (buffer.includes(prompt)) {
          this.child.stdout.removeListener('data', listener);
          clearTimeout(timeoutId);

          const split = buffer.split(prompt);
          const response = split[0].trim();

          resolve(response);
        }
      };

      const timeoutId = setTimeout(() => {
        this.child.stdout.removeListener('data', listener);
        reject(new Error(`Timeout waiting for response to command: ${command}`));
      }, 2000);

      this.child.stdout.on('data', listener);

      this.child.stdin.write(`${command}\n`, (err) => {
        if (err) {
          this.child.stdout.removeListener('data', listener);
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
    return parseInt((await this.getResponse('get_time')) || '0', 10);
  }

  public async isPlaying(): Promise<boolean> {
    return (await this.getResponse('is_playing')) === '1';
  }

  public async getTitle(): Promise<string> {
    return (await this.getResponse('get_title')) || '';
  }

  public async getLength(): Promise<number> {
    return parseInt((await this.getResponse('get_length')) || '0', 10);
  }

  public async getVolume(): Promise<number> {
    return parseInt((await this.getResponse('volume')) || '0', 10);
  }

  private async getTracks(command: VLCGetterCommands): Promise<BaseTrack[]> {
    const response = await this.getResponse(command);
    const tracks: BaseTrack[] = [];

    response.split('\n').forEach((line) => {
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
      volume: 0
    };

    const response = await this.getResponse('status');

    const stateMatch = response.match(/\(\s*state\s+(\w+)\s*\)/);
    if (stateMatch) {
      status.state = stateMatch[1];
    }

    const volumeMatch = response.match(/\(\s*audio\s+volume:\s*([\d.]+)\s*\)/);
    if (volumeMatch) {
      status.volume = parseInt(volumeMatch[1]);
    }

    return status;
  }
}

export const vlc = new VLC();
