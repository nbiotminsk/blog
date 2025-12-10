import fs from 'node:fs';
import path from 'node:path';

import dotenv from 'dotenv';

const nodeEnv = process.env.NODE_ENV ?? 'development';
const envFiles = ['.env', `.env.${nodeEnv}`];

for (const file of envFiles) {
  const fullPath = path.resolve(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    dotenv.config({ path: fullPath, override: true });
  }
}

const requireEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key];

  if (value === undefined || value === '') {
    if (defaultValue !== undefined) {
      return defaultValue;
    }

    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

export type AppConfig = {
  nodeEnv: string;
  port: number;
  logLevel: string;
  database: {
    url: string;
  };
  docService: {
    url: string;
  };
};

const config: AppConfig = {
  nodeEnv,
  port: Number.parseInt(process.env.PORT ?? '4000', 10),
  logLevel: process.env.LOG_LEVEL ?? 'info',
  database: {
    url: requireEnv('DATABASE_URL'),
  },
  docService: {
    url: requireEnv('DOC_SERVICE_URL'),
  },
};

export default config;
export { requireEnv };
