import { EntityRepository } from '../repositories/entity.repository';
import { EntityCategoriesRepository } from '../repositories/entity-categories.repository';
import { Entity } from '../types/db';

export class EntityService {
  private entityRepo: EntityRepository;
  private entityCategoriesRepo: EntityCategoriesRepository;

  constructor() {
    this.entityRepo = new EntityRepository();
    this.entityCategoriesRepo = new EntityCategoriesRepository();
  }

  async create(data: Partial<Entity> & { categoryIds?: string[] }): Promise<Entity> {
    const { categoryIds, ...entityData } = data;
    const entity = await this.entityRepo.create(entityData);

    if (categoryIds && categoryIds.length > 0) {
      for (const catId of categoryIds) {
        await this.entityCategoriesRepo.addCategoryToEntity(entity.id, catId);
      }
    }
    return entity;
  }

  async findById(id: string): Promise<Entity | undefined> {
    return this.entityRepo.findById(id);
  }

  async update(id: string, data: Partial<Entity> & { categoryIds?: string[] }): Promise<Entity | undefined> {
    const { categoryIds, ...entityData } = data;
    const entity = await this.entityRepo.update(id, entityData);

    if (entity && categoryIds) {
      const existingCategories = await this.entityCategoriesRepo.getCategoriesForEntity(id);
      
      const toAdd = categoryIds.filter(cid => !existingCategories.includes(cid));
      const toRemove = existingCategories.filter(cid => !categoryIds.includes(cid));
      
      for (const cid of toAdd) await this.entityCategoriesRepo.addCategoryToEntity(id, cid);
      for (const cid of toRemove) await this.entityCategoriesRepo.removeCategoryFromEntity(id, cid);
    }
    
    return entity;
  }

  async delete(id: string): Promise<void> {
    await this.entityRepo.delete(id);
  }

  async search(filters: { q?: string; email?: string; phone?: string }, limit: number, offset: number) {
    return this.entityRepo.search(filters, limit, offset);
  }
}
