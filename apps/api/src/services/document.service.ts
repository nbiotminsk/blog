import { DocumentRecordRepository } from '../repositories/document-record.repository';
import { EntityRepository } from '../repositories/entity.repository';
import { TemplateRepository } from '../repositories/template.repository';
import { DocumentRecord, Entity, Template } from '../types/db';
import * as fs from 'fs';
import * as path from 'path';

export class DocumentService {
  private docRecordRepo: DocumentRecordRepository;
  private entityRepo: EntityRepository;
  private templateRepo: TemplateRepository;

  constructor() {
    this.docRecordRepo = new DocumentRecordRepository();
    this.entityRepo = new EntityRepository();
    this.templateRepo = new TemplateRepository();
  }

  async generate(templateId: string, entityId: string, payload: Record<string, unknown>): Promise<{ record: DocumentRecord, stream: fs.ReadStream }> {
    const template = await this.templateRepo.findById(templateId);
    if (!template) throw new Error('Template not found');

    const entity = await this.entityRepo.findById(entityId);
    if (!entity) throw new Error('Entity not found');

    const record = await this.docRecordRepo.create({
      template_id: templateId,
      entity_id: entityId,
      payload,
      status: 'processing',
    });

    try {
      // Mock doc service call
      const generatedFilePath = await this.mockCallDocService(template, entity, payload);

      const updatedRecord = await this.docRecordRepo.update(record.id, {
        status: 'completed',
        generated_file_path: generatedFilePath,
        completed_at: new Date(),
      });

      if (!updatedRecord) throw new Error('Failed to update record');

      const stream = fs.createReadStream(generatedFilePath);

      return { record: updatedRecord, stream };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        await this.docRecordRepo.update(record.id, {
            status: 'failed',
            error: errorMessage,
            completed_at: new Date(),
        });
        throw error;
    }
  }

  async listRecords(filters?: { entity_id?: string; template_id?: string; status?: string }): Promise<DocumentRecord[]> {
    return await this.docRecordRepo.findWithRelations(filters);
  }

  async getRecord(id: string): Promise<DocumentRecord | null> {
    return await this.docRecordRepo.findByIdWithRelations(id);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async mockCallDocService(template: Template, _entity: Entity, _payload: Record<string, unknown>): Promise<string> {
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 100));

      // We will just copy the template file to a new location as the "generated" file
      const uploadsDir = path.dirname(template.storage_path);
      const generatedFilename = `generated-${Date.now()}-${path.basename(template.storage_path)}`;
      const generatedPath = path.join(uploadsDir, generatedFilename);

      // If template file doesn't exist (e.g. was just mocked or in tests), create a dummy one if it doesn't exist
      if (!fs.existsSync(template.storage_path)) {
           // Ensure directory exists
           const dir = path.dirname(template.storage_path);
           if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
           fs.writeFileSync(template.storage_path, 'Dummy template content');
       }

      fs.copyFileSync(template.storage_path, generatedPath);

      return generatedPath;
  }
}
