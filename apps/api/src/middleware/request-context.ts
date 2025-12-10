import { NextFunction, Request, Response } from 'express';

import { createRequestScopedDb } from '../db';

export const requestContext = (req: Request, _res: Response, next: NextFunction): void => {
  req.db = createRequestScopedDb();
  next();
};
