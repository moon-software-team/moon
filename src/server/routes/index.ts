import { Router } from 'express';
import plexRouter from './plex';

const mainRouter = Router();

mainRouter.use('/plex', plexRouter);

export default mainRouter;
