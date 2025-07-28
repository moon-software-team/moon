import 'express';

declare global {
  namespace Express {
    interface Request {
      value?: any;
    }
  }
}
