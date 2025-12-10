import type { Knex } from 'knex';

declare global {
  namespace Express {
    interface Request {
      db: Knex;
    }
  }
}

export {};
