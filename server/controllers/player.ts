/** Dependencies */
import { Request, Response, NextFunction } from 'express';
import { VLCPlayer } from '@server/services';
import fs from 'fs';
import path from 'path';

/**
 * @brief Player Controller
 * @description This controller handles player-related requests.
 */
class PlayerController {
  /**
   * @brief Get player status
   * @param req - The request object
   * @param res - The response object
   */
  public async getStatus(req: Request, res: Response) {
    // Check if the player is open before proceeding
    if (!process.moon || !process.moon.player || !process.moon.player.isOpen()) {
      return res.status(400).json({ error: 'Player is not opened', code: 400 });
    }

    try {
      const status = await process.moon.player.getStatus();
      res.status(200).json(status);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get player status', code: 500 });
    }
  }

  public async open(req: Request, res: Response) {
    // Check if the player is open before proceeding
    if (process.moon && process.moon.player && process.moon.player.isOpen()) {
      return res.status(400).json({ error: 'Player is already opened', code: 400 });
    }

    // Check the process moon namespace and initialize the VLC player if it doesn't exist
    if (!process.moon) {
      process.moon = {
        player: new VLCPlayer()
      };
    } else if (!process.moon.player) {
      // Initialize the VLC player if it doesn't exist
      process.moon.player = new VLCPlayer();
    }

    // Deconstruct input and options from the request body
    const { input, options } = req.body;

    // Check if input is provided and valid
    if (!input || typeof input !== 'string') {
      return res.status(400).json({ error: 'Invalid input', code: 400 });
    }

    // Check if the input file exists
    if (!fs.existsSync(path.resolve(input))) {
      return res.status(404).json({ error: 'Input file not found', code: 404 });
    }

    try {
      // Open the player with the provided input and options
      await process.moon.player.open(path.resolve(input), []);

      // If options are provided, apply them to the player
      if (options && options.startTime) {
        await process.moon.player.seek(options.startTime);
      }

      if (options && options.audioTrack) {
        await process.moon.player.selectAudioTrack(options.audioTrack);
      }

      if (options && options.subtitleTrack) {
        await process.moon.player.selectSubtitleTrack(options.subtitleTrack);
      }

      if (options && options.videoTrack) {
        await process.moon.player.selectVideoTrack(options.videoTrack);
      }

      if (options && options.volume) {
        await process.moon.player.setVolume(options.volume);
      }

      // Get the player status after opening
      const status = await process.moon.player.getStatus();

      // Respond with the status of the player
      res.status(200).json({ message: 'Player opened successfully', code: 200, status });
    } catch (error) {
      // Handle any errors that occur while opening the player
      res.status(500).json({ error: 'Failed to open player', code: 500, details: error.message });
    }
  }

  /**
   * @brief Play the media in the player
   * @param req - The request object
   * @param res - The response object
   */
  public async play(req: Request, res: Response) {
    // Check if the player is open before proceeding
    if (!process.moon || !process.moon.player || !process.moon.player.isOpen()) {
      return res.status(400).json({ error: 'Player is not opened', code: 400 });
    }

    // Attempt to play the media
    try {
      await process.moon.player.play();
      const status = await process.moon.player.getStatus();
      res.status(200).json(status);
    } catch (error) {
      res.status(500).json({ error: 'Failed to play the media', code: 500 });
    }
  }

  /**
   * @brief Pause the media in the player
   * @param req - The request object
   * @param res - The response object
   */
  public async pause(req: Request, res: Response) {
    // Check if the player is open before proceeding
    if (!process.moon || !process.moon.player || !process.moon.player.isOpen()) {
      return res.status(400).json({ error: 'Player is not opened', code: 400 });
    }

    // Attempt to pause the media
    try {
      await process.moon.player.pause();
      const status = await process.moon.player.getStatus();
      res.status(200).json(status);
    } catch (error) {
      res.status(500).json({ error: 'Failed to pause the media', code: 500 });
    }
  }

  /**
   * @brief Stop the media in the player
   * @param req - The request object
   * @param res - The response object
   */
  public async stop(req: Request, res: Response) {
    // Check if the player is open before proceeding
    if (!process.moon || !process.moon.player || !process.moon.player.isOpen()) {
      return res.status(400).json({ error: 'Player is not opened', code: 400 });
    }

    // Attempt to stop the media
    try {
      await process.moon.player.stop();
      const status = await process.moon.player.getStatus();
      res.status(200).json(status);
    } catch (error) {
      res.status(500).json({ error: 'Failed to stop the media', code: 500 });
    }
  }

  /**
   * @brief Seek to a specific time in the media
   * @param req - The request object
   * @param res - The response object
   */
  public async seek(req: Request, res: Response) {
    // Check if the player is open before proceeding
    if (!process.moon || !process.moon.player || !process.moon.player.isOpen()) {
      return res.status(400).json({ error: 'Player is not opened', code: 400 });
    }

    // Deconstruct value from the request body
    const { value } = req.body;

    // Attempt to seek to the specified time
    try {
      await process.moon.player.seek(value);
      const status = await process.moon.player.getStatus();
      res.status(200).json(status);
    } catch (error) {
      res.status(500).json({ error: 'Failed to seek in the media', code: 500 });
    }
  }

  /**
   * @brief Select an audio track
   * @param req - The request object
   * @param res - The response object
   */
  public async selectAudioTrack(req: Request, res: Response) {
    // Check if the player is open before proceeding
    if (!process.moon || !process.moon.player || !process.moon.player.isOpen()) {
      return res.status(400).json({ error: 'Player is not opened', code: 400 });
    }

    // Deconstruct track from the request body
    const { track } = req.body;

    // Attempt to select the audio track
    try {
      await process.moon.player.selectAudioTrack(track);
      const status = await process.moon.player.getStatus();
      res.status(200).json(status);
    } catch (error) {
      res.status(500).json({ error: 'Failed to select audio track', code: 500 });
    }
  }

  /**
   * @brief Select a subtitle track
   * @param req - The request object
   * @param res - The response object
   */
  public async selectSubtitleTrack(req: Request, res: Response) {
    // Check if the player is open before proceeding
    if (!process.moon || !process.moon.player || !process.moon.player.isOpen()) {
      return res.status(400).json({ error: 'Player is not opened', code: 400 });
    }

    // Deconstruct track from the request body
    const { track } = req.body;

    // Attempt to select the subtitle track
    try {
      await process.moon.player.selectSubtitleTrack(track);
      const status = await process.moon.player.getStatus();
      res.status(200).json(status);
    } catch (error) {
      res.status(500).json({ error: 'Failed to select subtitle track', code: 500 });
    }
  }

  /**
   * @brief Select a video track
   * @param req - The request object
   * @param res - The response object
   */
  public async selectVideoTrack(req: Request, res: Response) {
    // Check if the player is open before proceeding
    if (!process.moon || !process.moon.player || !process.moon.player.isOpen()) {
      return res.status(400).json({ error: 'Player is not opened', code: 400 });
    }

    // Deconstruct track from the request body
    const { track } = req.body;

    // Attempt to select the video track
    try {
      await process.moon.player.selectVideoTrack(track);
      const status = await process.moon.player.getStatus();
      res.status(200).json(status);
    } catch (error) {
      res.status(500).json({ error: 'Failed to select video track', code: 500 });
    }
  }

  /**
   * @brief Set the volume of the player
   * @param req - The request object
   * @param res - The response object
   */
  public async setVolume(req: Request, res: Response) {
    // Check if the player is open before proceeding
    if (!process.moon || !process.moon.player || !process.moon.player.isOpen()) {
      return res.status(400).json({ error: 'Player is not opened', code: 400 });
    }

    // Deconstruct volume from the request body
    const { value } = req.body;

    // Attempt to set the volume
    try {
      await process.moon.player.setVolume(value);
      const status = await process.moon.player.getStatus();
      res.status(200).json(status);
    } catch (error) {
      res.status(500).json({ error: 'Failed to set volume', code: 500 });
    }
  }

  /**
   * @brief Toggle fullscreen mode
   * @param req - The request object
   * @param res - The response object
   */
  public async setFullscreen(req: Request, res: Response) {
    // Check if the player is open before proceeding
    if (!process.moon || !process.moon.player || !process.moon.player.isOpen()) {
      return res.status(400).json({ error: 'Player is not opened', code: 400 });
    }

    // Deconstruct fullscreen from the request body
    const { enabled } = req.body;

    // Attempt to set fullscreen mode
    try {
      // Check the current fullscreen state
      const { fullscreen } = await process.moon.player.getStatus();

      // Toggle fullscreen only if the current state is different from the requested state
      if (fullscreen !== Boolean(enabled)) {
        await process.moon.player.toggleFullscreen();
      }

      // Get the updated status after toggling fullscreen
      const status = await process.moon.player.getStatus();
      res.status(200).json(status);
    } catch (error) {
      res.status(500).json({ error: 'Failed to toggle fullscreen', code: 500 });
    }
  }

  /**
   * @brief Toggle repeat mode
   * @param req - The request object
   * @param res - The response object
   */
  public async setRepeat(req: Request, res: Response) {
    // Check if the player is open before proceeding
    if (!process.moon || !process.moon.player || !process.moon.player.isOpen()) {
      return res.status(400).json({ error: 'Player is not opened', code: 400 });
    }

    // Deconstruct repeat from the request body
    const { enabled } = req.body;

    // Attempt to set repeat mode
    try {
      // Check the current repeat state
      const { repeat } = await process.moon.player.getStatus();

      // Toggle repeat only if the current state is different from the requested state
      if (repeat !== Boolean(enabled)) {
        await process.moon.player.toggleRepeat();
      }

      // Get the updated status after toggling repeat
      const status = await process.moon.player.getStatus();
      res.status(200).json(status);
    } catch (error) {
      res.status(500).json({ error: 'Failed to set repeat mode', code: 500 });
    }
  }

  /**
   * @brief Toggle random mode
   * @param req - The request object
   * @param res - The response object
   */
  public async setRandom(req: Request, res: Response) {
    // Check if the player is open before proceeding
    if (!process.moon || !process.moon.player || !process.moon.player.isOpen()) {
      return res.status(400).json({ error: 'Player is not opened', code: 400 });
    }

    // Deconstruct random from the request body
    const { enabled } = req.body;

    // Attempt to set random mode
    try {
      // Check the current random state
      const { random } = await process.moon.player.getStatus();

      // Toggle random only if the current state is different from the requested state
      if (random !== Boolean(enabled)) {
        await process.moon.player.toggleRandom();
      }

      // Get the updated status after toggling random
      const status = await process.moon.player.getStatus();
      res.status(200).json(status);
    } catch (error) {
      res.status(500).json({ error: 'Failed to set random mode', code: 500 });
    }
  }

  /**
   * @brief Toggle loop mode
   * @param req - The request object
   * @param res - The response object
   */
  public async setLoop(req: Request, res: Response) {
    // Check if the player is open before proceeding
    if (!process.moon || !process.moon.player || !process.moon.player.isOpen()) {
      return res.status(400).json({ error: 'Player is not opened', code: 400 });
    }

    // Deconstruct loop from the request body
    const { enabled } = req.body;

    // Attempt to set loop mode
    try {
      // Check the current loop state
      const { loop } = await process.moon.player.getStatus();

      // Toggle loop only if the current state is different from the requested state
      if (loop !== Boolean(enabled)) {
        await process.moon.player.toggleLoop();
      }

      // Get the updated status after toggling loop
      const status = await process.moon.player.getStatus();
      res.status(200).json(status);
    } catch (error) {
      res.status(500).json({ error: 'Failed to set loop mode', code: 500 });
    }
  }

  /**
   * @brief Handle next track action
   * @param req - The request object
   * @param res - The response object
   */
  public async next(req: Request, res: Response) {
    // Check if the player is open before proceeding
    if (!process.moon || !process.moon.player || !process.moon.player.isOpen()) {
      return res.status(400).json({ error: 'Player is not opened', code: 400 });
    }

    // Attempt to play the next track
    try {
      await process.moon.player.next();
      const status = await process.moon.player.getStatus();
      res.status(200).json(status);
    } catch (error) {
      res.status(500).json({ error: 'Failed to play next track', code: 500 });
    }
  }

  /**
   * @brief Handle previous track action
   * @param req - The request object
   * @param res - The response object
   */
  public async previous(req: Request, res: Response) {
    // Check if the player is open before proceeding
    if (!process.moon || !process.moon.player || !process.moon.player.isOpen()) {
      return res.status(400).json({ error: 'Player is not opened', code: 400 });
    }

    // Attempt to play the previous track
    try {
      await process.moon.player.previous();
      const status = await process.moon.player.getStatus();
      res.status(200).json(status);
    } catch (error) {
      res.status(500).json({ error: 'Failed to play previous track', code: 500 });
    }
  }

  /**
   * @brief Set the aspect ratio of the player
   * @param req - The request object
   * @param res - The response object
   */
  public async setAspectRatio(req: Request, res: Response) {
    // Check if the player is open before proceeding
    if (!process.moon || !process.moon.player || !process.moon.player.isOpen()) {
      return res.status(400).json({ error: 'Player is not opened', code: 400 });
    }

    // Deconstruct aspect ratio from the request body
    const { value } = req.body;

    // Attempt to set the aspect ratio
    try {
      await process.moon.player.setAspectRatio(value);
      const status = await process.moon.player.getStatus();
      res.status(200).json(status);
    } catch (error) {
      res.status(500).json({ error: 'Failed to set aspect ratio', code: 500 });
    }
  }
}

/** Export the player controller instance */
export const playerController = new PlayerController();
