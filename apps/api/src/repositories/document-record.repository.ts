import { Knex } from 'knex';
import { knexInstance } from '../db';
import { DocumentRecord } from '../types/db';

export class DocumentRecordRepository {
  private db: Knex;

  constructor(db: Knex = knexInstance) {
    this.db = db;
  }

  async create(data: Partial<DocumentRecord>): Promise<DocumentRecord> {
    const [record] = await this.db('document_records').insert(data).returning('*');
    return record;
  }

  async findById(id: string): Promise<DocumentRecord | undefined> {
    return this.db('document_records').where({ id }).first();
  }

  async update(id: string, data: Partial<DocumentRecord>): Promise<DocumentRecord | undefined> {
    const [record] = await this.db('document_records').where({ id }).update(data).returning('*');
    return record;
  }
}
