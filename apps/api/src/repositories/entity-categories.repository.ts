import { Knex } from 'knex';
import { knexInstance } from '../db';

export class EntityCategoriesRepository {
  private db: Knex;

  constructor(db: Knex = knexInstance) {
    this.db = db;
  }

  async addCategoryToEntity(entityId: string, categoryId: string): Promise<void> {
    await this.db('entity_categories').insert({ entity_id: entityId, category_id: categoryId }).onConflict(['entity_id', 'category_id']).ignore();
  }

  async removeCategoryFromEntity(entityId: string, categoryId: string): Promise<void> {
    await this.db('entity_categories')
      .where({ entity_id: entityId, category_id: categoryId })
      .delete();
  }

  async getCategoriesForEntity(entityId: string): Promise<string[]> {
      const results = await this.db('entity_categories')
        .select('category_id')
        .where({ entity_id: entityId });
      return results.map(r => r.category_id);
  }
}
