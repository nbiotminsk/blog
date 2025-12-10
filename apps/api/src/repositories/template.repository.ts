import { Knex } from 'knex';
import { knexInstance } from '../db';
import { Template } from '../types/db';

export class TemplateRepository {
  private db: Knex;

  constructor(db: Knex = knexInstance) {
    this.db = db;
  }

  async create(data: Partial<Template>): Promise<Template> {
    const [template] = await this.db('templates').insert(data).returning('*');
    return template;
  }

  async findById(id: string): Promise<Template | undefined> {
    return this.db('templates').where({ id }).first();
  }

  async update(id: string, data: Partial<Template>): Promise<Template | undefined> {
    const [template] = await this.db('templates').where({ id }).update(data).returning('*');
    return template;
  }

  async delete(id: string): Promise<void> {
    await this.db('templates').where({ id }).delete();
  }

  async findAll(limit: number, offset: number): Promise<{ data: Template[]; total: number }> {
    const data = await this.db('templates').limit(limit).offset(offset).orderBy('created_at', 'desc');
    const result = await this.db('templates').count<{ count: string }[]>('id as count');
    const total = parseInt(result[0].count, 10);
    return { data, total };
  }
}
