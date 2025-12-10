import type { Knex } from 'knex';

import config from './src/config/env';

const shared: Omit<Knex.Config, 'connection'> = {
  client: 'pg',
  pool: { min: 2, max: 10 },
  migrations: {
    extension: 'ts',
    directory: './src/db/migrations',
    tableName: 'knex_migrations',
  },
  seeds: {
    extension: 'ts',
    directory: './src/db/seeds',
  },
};

const knexConfig: Record<string, Knex.Config> = {
  development: {
    ...shared,
    connection: config.database.url,
  },
  test: {
    ...shared,
    connection: process.env.TEST_DATABASE_URL ?? config.database.url,
  },
  production: {
    ...shared,
    connection: config.database.url,
  },
};

export = knexConfig;
