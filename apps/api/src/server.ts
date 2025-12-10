import config from './config/env';
import { closeDatabase } from './db';
import app from './app';

const server = app.listen(config.port, () => {
  console.log(`API listening on port ${config.port}`);
});

const shutdown = async () => {
  await closeDatabase();
  server.close(() => process.exit(0));
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
