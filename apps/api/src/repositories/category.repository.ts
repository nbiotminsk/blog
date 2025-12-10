import { Knex } from 'knex';
import { knexInstance } from '../db';
import { Category } from '../types/db';

export class CategoryRepository {
  private db: Knex;

  constructor(db: Knex = knexInstance) {
    this.db = db;
  }

  async create(data: Partial<Category>): Promise<Category> {
    const [category] = await this.db('categories').insert(data).returning('*');
    return category;
  }

  async findById(id: string): Promise<Category | undefined> {
    return this.db('categories').where({ id }).first();
  }

  async update(id: string, data: Partial<Category>): Promise<Category | undefined> {
    const [category] = await this.db('categories').where({ id }).update(data).returning('*');
    return category;
  }

  async delete(id: string): Promise<void> {
    await this.db('categories').where({ id }).delete();
  }

  async findAll(limit: number, offset: number): Promise<{ data: Category[]; total: number }> {
    const data = await this.db('categories').limit(limit).offset(offset).orderBy('created_at', 'desc');
    const result = await this.db('categories').count<{ count: string }[]>('id as count');
    const total = parseInt(result[0].count, 10);
    return { data, total };
  }
}
