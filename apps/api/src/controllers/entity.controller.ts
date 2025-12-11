import { Request, Response } from 'express';
import { EntityService } from '../services/entity.service';

const entityService = new EntityService();

export const listEntities = async (req: Request, res: Response) => {
  try {
    const entities = await entityService.findAll();
    res.json(entities);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

export const createEntity = async (req: Request, res: Response) => {
  try {
    const entity = await entityService.create(req.body);
    res.status(201).json(entity);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

export const getEntity = async (req: Request, res: Response) => {
  try {
    const entity = await entityService.findById(req.params.id);
    if (!entity) return res.status(404).json({ message: 'Entity not found' });
    res.json(entity);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

export const updateEntity = async (req: Request, res: Response) => {
  try {
    const entity = await entityService.update(req.params.id, req.body);
    if (!entity) return res.status(404).json({ message: 'Entity not found' });
    res.json(entity);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

export const deleteEntity = async (req: Request, res: Response) => {
  try {
    await entityService.delete(req.params.id);
    res.status(204).send();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

export const searchEntities = async (req: Request, res: Response) => {
  try {
      // req.query is validated and coerced by middleware
      const query = req.query as { limit?: number; page?: number; q?: string; email?: string; phone?: string };
      const { limit = 20, page = 1, ...filters } = query;
      const offset = (page - 1) * limit;
      const result = await entityService.search(filters, limit, offset);
      
      const totalPages = Math.ceil(result.total / limit);
      res.json({
        ...result,
        page,
        limit,
        totalPages,
      });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};
