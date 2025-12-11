import { Knex } from 'knex';
import { knexInstance } from '../db';
import { Entity } from '../types/db';
import { calculateDuplicateScore, DuplicatePair } from '../utils/similarity';

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

  async findAll(): Promise<Entity[]> {
    return this.db('entities').orderBy('created_at', 'desc');
  }

  async update(id: string, data: Partial<Entity>): Promise<Entity | undefined> {
    const [entity] = await this.db('entities').where({ id }).update(data).returning('*');
    return entity;
  }

  async delete(id: string): Promise<void> {
    await this.db('entities').where({ id }).delete();
  }

  async findAllPaginated(limit: number, offset: number): Promise<{ data: Entity[]; total: number }> {
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

  async findAllDuplicatePairs(threshold: number = 0.5): Promise<DuplicatePair[]> {
    const entities = await this.db('entities').orderBy('created_at', 'desc');
    const duplicates: DuplicatePair[] = [];

    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const e1 = entities[i];
        const e2 = entities[j];

        const score = calculateDuplicateScore(e1.name, e1.email, e1.phone, e2.name, e2.email, e2.phone);

        if (score >= threshold) {
          const emailMatch = e1.email.toLowerCase() === e2.email.toLowerCase();
          const normalizedPhone1 = (e1.phone || '').replace(/[^\d+]/g, '');
          const normalizedPhone2 = (e2.phone || '').replace(/[^\d+]/g, '');
          const phoneMatch = normalizedPhone1 !== '' && normalizedPhone1 === normalizedPhone2;

          const nameSimilarity = calculateDuplicateScore(e1.name, e1.email, e1.phone, e2.name, e2.email, e2.phone) * 0.4 / 0.4;

          duplicates.push({
            id1: e1.id,
            name1: e1.name,
            email1: e1.email,
            phone1: e1.phone,
            id2: e2.id,
            name2: e2.name,
            email2: e2.email,
            phone2: e2.phone,
            nameSimilarity,
            emailMatch,
            phoneMatch,
            compositeScore: score,
          });
        }
      }
    }

    return duplicates.sort((a, b) => b.compositeScore - a.compositeScore);
  }

  async findDuplicatesForEntity(entityId: string, threshold: number = 0.5): Promise<DuplicatePair[]> {
    const entity = await this.findById(entityId);
    if (!entity) return [];

    const allEntities = await this.db('entities').where('id', '!=', entityId).orderBy('created_at', 'desc');
    const duplicates: DuplicatePair[] = [];

    for (const other of allEntities) {
      const score = calculateDuplicateScore(entity.name, entity.email, entity.phone, other.name, other.email, other.phone);

      if (score >= threshold) {
        const emailMatch = entity.email.toLowerCase() === other.email.toLowerCase();
        const normalizedPhone1 = (entity.phone || '').replace(/[^\d+]/g, '');
        const normalizedPhone2 = (other.phone || '').replace(/[^\d+]/g, '');
        const phoneMatch = normalizedPhone1 !== '' && normalizedPhone1 === normalizedPhone2;

        const nameSimilarity = calculateDuplicateScore(entity.name, entity.email, entity.phone, other.name, other.email, other.phone) * 0.4 / 0.4;

        duplicates.push({
          id1: entity.id,
          name1: entity.name,
          email1: entity.email,
          phone1: entity.phone,
          id2: other.id,
          name2: other.name,
          email2: other.email,
          phone2: other.phone,
          nameSimilarity,
          emailMatch,
          phoneMatch,
          compositeScore: score,
        });
      }
    }

    return duplicates.sort((a, b) => b.compositeScore - a.compositeScore);
  }
}
