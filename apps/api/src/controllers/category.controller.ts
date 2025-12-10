import { Request, Response } from 'express';
import { CategoryService } from '../services/category.service';

const categoryService = new CategoryService();

export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.create(req.body);
    res.status(201).json(category);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

export const getCategory = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.update(req.params.id, req.body);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    await categoryService.delete(req.params.id);
    res.status(204).send();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

export const listCategories = async (req: Request, res: Response) => {
  try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      const result = await categoryService.findAll(limit, offset);
      res.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};
