import type { Request, Response } from 'express';
import { plex } from '../services';

class PlexController {
  async getAllLibraries(req: Request, res: Response) {
    try {
      const libraries = await plex.getAllLibraries();
      res.status(200).json(libraries);
    } catch (error) {
      console.error('Error fetching libraries:', error);
      res.status(500).json({ code: 500, error: 'Internal Server Error' });
    }
  }

  async getLibraryDetails(req: Request, res: Response) {
    try {
      const sectionKey: number = req.value?.sectionKey;
      const content = await plex.getLibraryDetails(sectionKey);
      res.status(200).json(content);
    } catch (error) {
      console.error('Error fetching library details:', error);
      res.status(500).json({ code: 500, error: 'Internal Server Error ' });
    }
  }

  async getLibraryContent(req: Request, res: Response) {
    try {
      const sectionKey: number = req.value?.sectionKey;
      const content = await plex.getLibraryContent(sectionKey);
      res.status(200).json(content);
    } catch (error) {
      console.error('Error fetching library content:', error);
      res.status(500).json({ code: 500, error: 'Internal Server Error ' });
    }
  }
}

export const plexController = new PlexController();
