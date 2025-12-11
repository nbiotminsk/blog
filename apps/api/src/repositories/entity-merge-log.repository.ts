import { Knex } from 'knex';
import { knexInstance } from '../db';

export interface EntityMergeLog {
  id: string;
  primary_entity_id: string;
  duplicate_entity_id: string;
  merged_fields: Record<string, unknown>;
  note?: string;
  created_at: Date;
  updated_at: Date;
}

export class EntityMergeLogRepository {
  private db: Knex;

  constructor(db: Knex = knexInstance) {
    this.db = db;
  }

  async create(data: Partial<EntityMergeLog>): Promise<EntityMergeLog> {
    const [log] = await this.db('entity_merge_logs').insert(data).returning('*');
    return log;
  }

  async findByEntityId(entityId: string): Promise<EntityMergeLog[]> {
    return this.db('entity_merge_logs')
      .where('primary_entity_id', entityId)
      .orWhere('duplicate_entity_id', entityId)
      .orderBy('created_at', 'desc');
  }
}
