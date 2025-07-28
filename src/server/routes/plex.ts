import { Router } from 'express';
import { plexController } from '../controllers';
import { plexValidators } from '../validators';
import { validator } from '../middlewares';

const plexRouter = Router();

plexRouter.get('/libraries', plexController.getAllLibraries);

plexRouter.get(
  '/libraries/:sectionKey',
  validator.params(plexValidators['get-library-details']),
  plexController.getLibraryDetails
);

plexRouter.get(
  '/libraries/:sectionKey/all',
  validator.params(plexValidators['get-library-content']),
  plexController.getLibraryContent
);

plexRouter.get('/image', validator.query(plexValidators['get-image']), plexController.getImage);

export default plexRouter;
