import express, { Application } from 'express';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import healthRouter from './routes/health';
import templatesRouter from './routes/templates';
import documentsRouter from './routes/documents';

export function createApp(): Application {
  const app = express();

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(requestLogger);

  app.use(healthRouter);
  app.use(templatesRouter);
  app.use(documentsRouter);

  app.use(errorHandler);

  return app;
}
