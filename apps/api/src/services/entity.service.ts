import { EntityRepository } from '../repositories/entity.repository';
import { EntityCategoriesRepository } from '../repositories/entity-categories.repository';
import { DocumentRecordRepository } from '../repositories/document-record.repository';
import { EntityMergeLogRepository } from '../repositories/entity-merge-log.repository';
import { Entity } from '../types/db';
import { knexInstance } from '../db';

export class EntityService {
  private entityRepo: EntityRepository;
  private entityCategoriesRepo: EntityCategoriesRepository;
  private documentRecordRepo: DocumentRecordRepository;
  private entityMergeLogRepo: EntityMergeLogRepository;

  constructor() {
    this.entityRepo = new EntityRepository();
    this.entityCategoriesRepo = new EntityCategoriesRepository();
    this.documentRecordRepo = new DocumentRecordRepository();
    this.entityMergeLogRepo = new EntityMergeLogRepository();
  }

  async findAll(): Promise<Entity[]> {
    return this.entityRepo.findAll();
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

  async findDuplicates(threshold: number = 0.5, limit: number = 20, offset: number = 0) {
    const allDuplicates = await this.entityRepo.findAllDuplicatePairs(threshold);
    const total = allDuplicates.length;
    const data = allDuplicates.slice(offset, offset + limit);
    
    return { data, total };
  }

  async findDuplicatesForEntity(entityId: string, threshold: number = 0.5) {
    const entity = await this.entityRepo.findById(entityId);
    if (!entity) {
      throw new Error('Entity not found');
    }
    
    return this.entityRepo.findDuplicatesForEntity(entityId, threshold);
  }

  async mergeEntities(
    primaryEntityId: string,
    duplicateEntityId: string,
    mergedFields: Record<string, unknown>,
    categoryIds?: string[],
    note?: string,
  ): Promise<Entity> {
    const primaryEntity = await this.entityRepo.findById(primaryEntityId);
    const duplicateEntity = await this.entityRepo.findById(duplicateEntityId);

    if (!primaryEntity) {
      throw new Error('Primary entity not found');
    }

    if (!duplicateEntity) {
      throw new Error('Duplicate entity not found');
    }

    if (primaryEntityId === duplicateEntityId) {
      throw new Error('Cannot merge an entity with itself');
    }

    // Use transaction for atomic operations
    const trx = await knexInstance.transaction();

    try {
      // Update primary entity with merged fields
      const updatedEntity = await trx('entities')
        .where({ id: primaryEntityId })
        .update(mergedFields)
        .returning('*')
        .then(rows => rows[0]);

      if (!updatedEntity) {
        throw new Error('Failed to update primary entity');
      }

      // Reassign all document records from duplicate to primary
      await trx('document_records')
        .where({ entity_id: duplicateEntityId })
        .update({ entity_id: primaryEntityId });

      // Handle category reassignment
      if (categoryIds && categoryIds.length > 0) {
        const existingCategories = await trx('entity_categories')
          .where({ entity_id: primaryEntityId })
          .select('category_id');
        const existingCategoryIds = existingCategories.map(ec => ec.category_id);

        const toAdd = categoryIds.filter(cid => !existingCategoryIds.includes(cid));
        
        for (const cid of toAdd) {
          await trx('entity_categories').insert({
            entity_id: primaryEntityId,
            category_id: cid,
          }).onConflict(['entity_id', 'category_id']).ignore();
        }
      }

      // Remove categories from duplicate entity
      await trx('entity_categories')
        .where({ entity_id: duplicateEntityId })
        .delete();

      // Log the merge
      await trx('entity_merge_logs').insert({
        primary_entity_id: primaryEntityId,
        duplicate_entity_id: duplicateEntityId,
        merged_fields: mergedFields,
        note: note || null,
      });

      // Delete the duplicate entity
      await trx('entities').where({ id: duplicateEntityId }).delete();

      // Commit transaction
      await trx.commit();

      return updatedEntity;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
}
