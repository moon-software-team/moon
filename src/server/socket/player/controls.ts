import { DefaultSocket } from '../../../types';
import { vlc } from '../../services';

export const onPlay = async (socket: DefaultSocket) => {
  if (vlc.isOpen()) {
    try {
      await vlc.play();
      socket.emit('play', true);
    } catch (error) {
      socket.emit('play', false);
    }
  } else {
    socket.emit('play', false);
  }
};

export const onPause = async (socket: DefaultSocket) => {
  if (vlc.isOpen()) {
    try {
      await vlc.pause();
      socket.emit('pause', true);
    } catch (error) {
      socket.emit('pause', false);
    }
  } else {
    socket.emit('pause', false);
  }
};

export const onTogglePlayPause = async (socket: DefaultSocket) => {
  if (vlc.isOpen()) {
    try {
      await vlc.togglePlayPause();
      socket.emit('toggle-play-pause', true);
    } catch (error) {
      socket.emit('toggle-play-pause', false);
    }
  } else {
    socket.emit('toggle-play-pause', false);
  }
};

export const onVolume = async (socket: DefaultSocket, volume: number) => {
  if (vlc.isOpen()) {
    try {
      await vlc.setVolumePercent(volume);
      socket.emit('volume', true);
    } catch (error) {
      socket.emit('volume', false);
    }
  } else {
    socket.emit('volume', false);
  }
};

export const onSeek = async (socket: DefaultSocket, seekTime: number) => {
  if (vlc.isOpen()) {
    try {
      await vlc.seek(seekTime);
      socket.emit('seek', true);
    } catch (error) {
      socket.emit('seek', false);
    }
  } else {
    socket.emit('seek', false);
  }
};

export const onSeekRelative = async (socket: DefaultSocket, seekTime: number) => {
  if (vlc.isOpen()) {
    try {
      await vlc.seekRelative(seekTime);
      socket.emit('seek-relative', true);
    } catch (error) {
      socket.emit('seek-relative', false);
    }
  } else {
    socket.emit('seek-relative', false);
  }
};

export const onSeekPercent = async (socket: DefaultSocket, seekPercent: number) => {
  if (vlc.isOpen()) {
    try {
      await vlc.seekToPercent(seekPercent);
      socket.emit('seek-percent', true);
    } catch (error) {
      socket.emit('seek-percent', false);
    }
  } else {
    socket.emit('seek-percent', false);
  }
};
