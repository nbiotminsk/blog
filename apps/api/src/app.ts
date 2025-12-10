import express, { NextFunction, Request, Response } from 'express';

import routes from './routes';
import { requestContext } from './middleware/request-context';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestContext);

app.use('/api', routes);

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ message: err.message });
});

export default app;
