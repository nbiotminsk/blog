import knex, { Knex } from 'knex';

import config from '../config/env';

const knexConfig: Knex.Config = {
  client: 'pg',
  connection: config.database.url,
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
};

const knexInstance = knex(knexConfig);

const createRequestScopedDb = (): Knex => knexInstance;

const closeDatabase = async (): Promise<void> => {
  await knexInstance.destroy();
};

export { knexInstance, createRequestScopedDb, closeDatabase };
