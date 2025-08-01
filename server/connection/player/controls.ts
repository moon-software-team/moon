/** Dependencies */
import { DefaultSocket } from '@server/types';

export const onPlay = async (socket: DefaultSocket) => {
  if (process.moon.status === 'playing' && process.moon.player.isOpen()) {
    try {
      await process.moon.player.play();
      socket.emit('play', true);
    } catch (error) {
      socket.emit('play', false);
    }
  } else {
    socket.emit('play', false);
  }
};

export const onPause = async (socket: DefaultSocket) => {
  if (process.moon.status === 'playing' && process.moon.player.isOpen()) {
    try {
      await process.moon.player.pause();
      socket.emit('pause', true);
    } catch (error) {
      socket.emit('pause', false);
    }
  } else {
    socket.emit('pause', false);
  }
};

export const onTogglePlayPause = async (socket: DefaultSocket) => {
  if (process.moon.status === 'playing' && process.moon.player.isOpen()) {
    try {
      await process.moon.player.pause();
      socket.emit('toggle-play-pause', true);
    } catch (error) {
      socket.emit('toggle-play-pause', false);
    }
  } else {
    socket.emit('toggle-play-pause', false);
  }
};

export const onVolume = async (socket: DefaultSocket, volume: number) => {
  if (process.moon.status === 'playing' && process.moon.player.isOpen()) {
    try {
      await process.moon.player.setVolume(Math.round((volume / 100) * 256));
      socket.emit('volume', true);
    } catch (error) {
      socket.emit('volume', false);
    }
  } else {
    socket.emit('volume', false);
  }
};

export const onSeek = async (socket: DefaultSocket, seekTime: number) => {
  if (process.moon.status === 'playing' && process.moon.player.isOpen()) {
    try {
      await process.moon.player.seek(seekTime);
      socket.emit('seek', true);
    } catch (error) {
      socket.emit('seek', false);
    }
  } else {
    socket.emit('seek', false);
  }
};

export const onSeekRelative = async (socket: DefaultSocket, seekTime: number) => {
  if (process.moon.status === 'playing' && process.moon.player.isOpen()) {
    try {
      const sign = seekTime >= 0 ? '+' : '-';
      await process.moon.player.seek(`${sign}${Math.abs(seekTime)}`);
      socket.emit('seek-relative', true);
    } catch (error) {
      socket.emit('seek-relative', false);
    }
  } else {
    socket.emit('seek-relative', false);
  }
};

export const onSeekPercent = async (socket: DefaultSocket, seekPercent: number) => {
  if (process.moon.status === 'playing' && process.moon.player.isOpen()) {
    try {
      await process.moon.player.seek(`${Math.max(0, Math.min(100, seekPercent))}%`);
      socket.emit('seek-percent', true);
    } catch (error) {
      socket.emit('seek-percent', false);
    }
  } else {
    socket.emit('seek-percent', false);
  }
};
