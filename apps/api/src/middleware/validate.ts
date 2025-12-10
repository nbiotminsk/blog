import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';

export const validateBody = (schema: ZodType<any>) => // eslint-disable-line @typescript-eslint/no-explicit-any
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      return next();
    } catch (error: unknown) {
      return res.status(400).json({ error });
    }
  };

export const validateQuery = (schema: ZodType<any>) => // eslint-disable-line @typescript-eslint/no-explicit-any
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = await schema.parseAsync(req.query);
      return next();
    } catch (error: unknown) {
      return res.status(400).json({ error });
    }
  };
