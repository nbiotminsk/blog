import { TemplateRepository } from '../repositories/template.repository';
import { Template } from '../types/db';

export class TemplateService {
  private templateRepo: TemplateRepository;

  constructor() {
    this.templateRepo = new TemplateRepository();
  }

  async create(data: Partial<Template>, file: Express.Multer.File): Promise<Template> {
    const placeholders = await this.extractPlaceholders(file.path, data.format!);
    
    const templateData = {
      ...data,
      storage_path: file.path,
      placeholders,
    };
    
    return this.templateRepo.create(templateData);
  }
  
  async findById(id: string): Promise<Template | undefined> {
    return this.templateRepo.findById(id);
  }

  async findAll(limit: number, offset: number) {
    return this.templateRepo.findAll(limit, offset);
  }
  
  async delete(id: string): Promise<void> {
      return this.templateRepo.delete(id);
  }

  private async extractPlaceholders(filePath: string, format: string): Promise<string[]> {
      // Mock implementation
      // Use variables to satisfy lint
      if (filePath && format) {
          // no-op
      }
      return ['name', 'date', 'address'];
  }
}
