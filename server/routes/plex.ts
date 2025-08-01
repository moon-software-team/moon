import { Router } from 'express';
import { plexController } from '../controllers';
import { plexValidator } from '../validators';
import { validator } from '../middlewares';

const plexRouter = Router();

plexRouter.get('/libraries', plexController.getAllLibraries);

plexRouter.get(
  '/libraries/:sectionKey',
  validator.params(plexValidator['get-library-details']),
  plexController.getLibraryDetails
);

plexRouter.get(
  '/libraries/:sectionKey/all',
  validator.params(plexValidator['get-library-content']),
  plexController.getLibraryContent
);

plexRouter.get('/image', validator.query(plexValidator['get-image']), plexController.getImage);

export default plexRouter;
