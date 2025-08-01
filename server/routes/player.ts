/** Dependencies */
import { Router } from 'express';
import { validator } from '@server/middlewares';
import { playerValidator } from '@server/validators';
import { playerController } from '@server/controllers';

/** Create the router */
const router = Router();

/** Get player status */
router.get('/status', playerController.getStatus);

/** Open player with input and options */
router.post('/open', validator.body(playerValidator['open']), playerController.open);

/** Player control actions */
router.post('/pause', playerController.pause);
router.post('/play', playerController.play);
router.post('/stop', playerController.stop);
router.post('/seek', validator.body(playerValidator['seek']), playerController.seek);

/** Player track selection */
router.post('/audio-track', validator.body(playerValidator['audio-track']), playerController.selectAudioTrack);
router.post('/subtitle-track', validator.body(playerValidator['subtitle-track']), playerController.selectSubtitleTrack);
router.post('/video-track', validator.body(playerValidator['video-track']), playerController.selectVideoTrack);

/** Player settings */
router.post('/volume', validator.body(playerValidator['volume']), playerController.setVolume);
router.post('/aspect-ratio', validator.body(playerValidator['aspect-ratio']), playerController.setAspectRatio);

/** Player playback settings */
router.post('/fullscreen', validator.body(playerValidator['fullscreen']), playerController.setFullscreen);
router.post('/repeat', validator.body(playerValidator['repeat']), playerController.setRepeat);
router.post('/random', validator.body(playerValidator['random']), playerController.setRandom);
router.post('/loop', validator.body(playerValidator['loop']), playerController.setLoop);

/** Player navigation */
router.post('/next', playerController.next);
router.post('/previous', playerController.previous);

/** Export the router */
export default router;
