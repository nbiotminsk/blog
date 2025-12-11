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

  async findByIdWithRelations(id: string): Promise<DocumentRecord | undefined> {
    const query = this.db('document_records')
      .select(
        'document_records.*',
        'entities.id as entity_id_rel',
        'entities.name as entity_name',
        'entities.email as entity_email',
        'entities.phone as entity_phone',
        'entities.metadata as entity_metadata',
        'entities.created_at as entity_created_at',
        'entities.updated_at as entity_updated_at',
        'templates.id as template_id_rel',
        'templates.name as template_name',
        'templates.format as template_format',
        'templates.storage_path as template_storage_path',
        'templates.file_size as template_file_size',
        'templates.placeholders as template_placeholders',
        'templates.created_at as template_created_at',
        'templates.updated_at as template_updated_at'
      )
      .leftJoin('entities', 'document_records.entity_id', 'entities.id')
      .leftJoin('templates', 'document_records.template_id', 'templates.id')
      .where('document_records.id', id)
      .first();

    const record = await query;

    if (record) {
      // Transform the data to match the expected structure
      const transformedRecord: DocumentRecord = {
        ...record,
        entity: {
          id: record.entity_id_rel,
          name: record.entity_name,
          email: record.entity_email,
          phone: record.entity_phone,
          metadata: record.entity_metadata,
          created_at: record.entity_created_at,
          updated_at: record.entity_updated_at,
        },
        template: {
          id: record.template_id_rel,
          name: record.template_name,
          format: record.template_format,
          storage_path: record.template_storage_path,
          file_size: record.template_file_size,
          placeholders: record.template_placeholders,
          created_at: record.template_created_at,
          updated_at: record.template_updated_at,
        },
      };

      // Remove the relational fields
      delete (transformedRecord as any).entity_id_rel;
      delete (transformedRecord as any).entity_name;
      delete (transformedRecord as any).entity_email;
      delete (transformedRecord as any).entity_phone;
      delete (transformedRecord as any).entity_metadata;
      delete (transformedRecord as any).entity_created_at;
      delete (transformedRecord as any).entity_updated_at;
      delete (transformedRecord as any).template_id_rel;
      delete (transformedRecord as any).template_name;
      delete (transformedRecord as any).template_format;
      delete (transformedRecord as any).template_storage_path;
      delete (transformedRecord as any).template_file_size;
      delete (transformedRecord as any).template_placeholders;
      delete (transformedRecord as any).template_created_at;
      delete (transformedRecord as any).template_updated_at;

      return transformedRecord;
    }

    return record;
  }

  async findWithRelations(filters?: { entity_id?: string; template_id?: string; status?: string }): Promise<DocumentRecord[]> {
    let query = this.db('document_records')
      .select(
        'document_records.*',
        'entities.id as entity_id_rel',
        'entities.name as entity_name',
        'entities.email as entity_email',
        'entities.phone as entity_phone',
        'entities.metadata as entity_metadata',
        'entities.created_at as entity_created_at',
        'entities.updated_at as entity_updated_at',
        'templates.id as template_id_rel',
        'templates.name as template_name',
        'templates.format as template_format',
        'templates.storage_path as template_storage_path',
        'templates.file_size as template_file_size',
        'templates.placeholders as template_placeholders',
        'templates.created_at as template_created_at',
        'templates.updated_at as template_updated_at'
      )
      .leftJoin('entities', 'document_records.entity_id', 'entities.id')
      .leftJoin('templates', 'document_records.template_id', 'templates.id')
      .orderBy('document_records.created_at', 'desc');

    if (filters?.entity_id) {
      query = query.where('document_records.entity_id', filters.entity_id);
    }

    if (filters?.template_id) {
      query = query.where('document_records.template_id', filters.template_id);
    }

    if (filters?.status) {
      query = query.where('document_records.status', filters.status);
    }

    const records = await query;

    // Transform the data to match the expected structure
    return records.map(record => {
      const transformedRecord: DocumentRecord = {
        ...record,
        entity: {
          id: record.entity_id_rel,
          name: record.entity_name,
          email: record.entity_email,
          phone: record.entity_phone,
          metadata: record.entity_metadata,
          created_at: record.entity_created_at,
          updated_at: record.entity_updated_at,
        },
        template: {
          id: record.template_id_rel,
          name: record.template_name,
          format: record.template_format,
          storage_path: record.template_storage_path,
          file_size: record.template_file_size,
          placeholders: record.template_placeholders,
          created_at: record.template_created_at,
          updated_at: record.template_updated_at,
        },
      };

      // Remove the relational fields
      delete (transformedRecord as any).entity_id_rel;
      delete (transformedRecord as any).entity_name;
      delete (transformedRecord as any).entity_email;
      delete (transformedRecord as any).entity_phone;
      delete (transformedRecord as any).entity_metadata;
      delete (transformedRecord as any).entity_created_at;
      delete (transformedRecord as any).entity_updated_at;
      delete (transformedRecord as any).template_id_rel;
      delete (transformedRecord as any).template_name;
      delete (transformedRecord as any).template_format;
      delete (transformedRecord as any).template_storage_path;
      delete (transformedRecord as any).template_file_size;
      delete (transformedRecord as any).template_placeholders;
      delete (transformedRecord as any).template_created_at;
      delete (transformedRecord as any).template_updated_at;

      return transformedRecord;
    });
  }

  async update(id: string, data: Partial<DocumentRecord>): Promise<DocumentRecord | undefined> {
    const [record] = await this.db('document_records').where({ id }).update(data).returning('*');
    return record;
  }

  async reassignEntity(fromEntityId: string, toEntityId: string): Promise<number> {
    const result = await this.db('document_records')
      .where({ entity_id: fromEntityId })
      .update({ entity_id: toEntityId });
    return result;
  }
}
