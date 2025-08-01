/** Dependencies */
import { Router } from 'express';

/** Import routes */
import playerRoutes from './player';
import plexRoutes from './plex';

/** Create router */
const router = Router();

/** Define routes */
router.use('/player', playerRoutes);
router.use('/plex', plexRoutes);

/** Export router */
export default router;
