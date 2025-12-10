import { Knex } from 'knex';
import { knexInstance } from '../db';
import { Entity } from '../types/db';

export class EntityRepository {
  private db: Knex;

  constructor(db: Knex = knexInstance) {
    this.db = db;
  }

  async create(data: Partial<Entity>): Promise<Entity> {
    const [entity] = await this.db('entities').insert(data).returning('*');
    return entity;
  }

  async findById(id: string): Promise<Entity | undefined> {
    return this.db('entities').where({ id }).first();
  }

  async update(id: string, data: Partial<Entity>): Promise<Entity | undefined> {
    const [entity] = await this.db('entities').where({ id }).update(data).returning('*');
    return entity;
  }

  async delete(id: string): Promise<void> {
    await this.db('entities').where({ id }).delete();
  }

  async findAll(limit: number, offset: number): Promise<{ data: Entity[]; total: number }> {
    const data = await this.db('entities').limit(limit).offset(offset).orderBy('created_at', 'desc');
    const result = await this.db('entities').count<{ count: string }[]>('id as count');
    const total = parseInt(result[0].count, 10);
    return { data, total };
  }

  async search(filters: { q?: string; email?: string; phone?: string }, limit: number, offset: number): Promise<{ data: Entity[]; total: number }> {
    const queryBuilder = this.db('entities');

    if (filters.q) {
       const q = filters.q;
       const term = `%${q}%`;
       queryBuilder.where(builder => {
           builder.whereRaw("search_vector @@ plainto_tsquery('simple', ?)", [q])
            .orWhere('name', 'ilike', term)
            .orWhere('email', 'ilike', term)
            .orWhere('phone', 'ilike', term);
       });
    }

    if (filters.email) {
        queryBuilder.where('email', 'ilike', `%${filters.email}%`);
    }

    if (filters.phone) {
        queryBuilder.where('phone', 'ilike', `%${filters.phone}%`);
    }

    const data = await queryBuilder.clone().limit(limit).offset(offset).orderBy('created_at', 'desc');
    const countResult = await queryBuilder.clone().count<{ count: string }[]>('id as count');
    const total = parseInt(countResult[0]?.count || '0', 10);

    return { data, total };
  }
}
