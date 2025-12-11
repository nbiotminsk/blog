import { createApp } from './app';
import { config } from './config';
import { logger } from './utils/logger';
import { ensureDir } from './utils/fileOps';

async function bootstrap(): Promise<void> {
  try {
    await ensureDir(config.templateStoragePath);
    await ensureDir(config.tempStoragePath);
    await ensureDir(config.carboneTempDir);

    logger.info(
      {
        templateStoragePath: config.templateStoragePath,
        tempStoragePath: config.tempStoragePath,
        carboneTempDir: config.carboneTempDir,
      },
      'Storage directories initialized'
    );

    const app = createApp();

    app.listen(config.port, () => {
      logger.info(
        {
          port: config.port,
          nodeEnv: config.nodeEnv,
        },
        'Doc service started successfully'
      );
    });
  } catch (error) {
    logger.fatal({ error }, 'Failed to start doc service');
    process.exit(1);
  }
}

bootstrap();
