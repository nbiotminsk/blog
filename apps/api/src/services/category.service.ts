import { CategoryRepository } from '../repositories/category.repository';
import { Category } from '../types/db';

export class CategoryService {
  private categoryRepo: CategoryRepository;

  constructor() {
    this.categoryRepo = new CategoryRepository();
  }

  async create(data: Partial<Category>): Promise<Category> {
    return this.categoryRepo.create(data);
  }

  async findById(id: string): Promise<Category | undefined> {
    return this.categoryRepo.findById(id);
  }

  async update(id: string, data: Partial<Category>): Promise<Category | undefined> {
    return this.categoryRepo.update(id, data);
  }

  async delete(id: string): Promise<void> {
    return this.categoryRepo.delete(id);
  }

  async findAll(limit: number, offset: number) {
    return this.categoryRepo.findAll(limit, offset);
  }
}
