import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  port: z.coerce.number().int().positive().default(3001),
  nodeEnv: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  logLevel: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
    .default('info'),
  templateStoragePath: z.string().default('/tmp/templates'),
  tempStoragePath: z.string().default('/tmp/doc-service'),
  carboneTempDir: z.string().default('/tmp/carbone'),
});

const rawConfig = {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  logLevel: process.env.LOG_LEVEL,
  templateStoragePath: process.env.TEMPLATE_STORAGE_PATH,
  tempStoragePath: process.env.TEMP_STORAGE_PATH,
  carboneTempDir: process.env.CARBONE_TEMP_DIR,
};

export const config = configSchema.parse(rawConfig);

export type Config = z.infer<typeof configSchema>;
