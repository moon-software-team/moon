/** Dependencies */
import { Router } from 'express';

/** Import routes */
import playerRoutes from './player';

/** Create router */
const router = Router();

/** Define routes */
router.use('/player', playerRoutes);

/** Export router */
export default router;
