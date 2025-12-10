import { Request, Response } from 'express';
import { TemplateService } from '../services/template.service';

const templateService = new TemplateService();

export const createTemplate = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
        return res.status(400).json({ message: 'File is required' });
    }
    const template = await templateService.create(req.body, req.file);
    res.status(201).json(template);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

export const getTemplate = async (req: Request, res: Response) => {
  try {
    const template = await templateService.findById(req.params.id);
    if (!template) return res.status(404).json({ message: 'Template not found' });
    res.json(template);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

export const listTemplates = async (req: Request, res: Response) => {
  try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      const result = await templateService.findAll(limit, offset);
      res.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

export const deleteTemplate = async (req: Request, res: Response) => {
  try {
    await templateService.delete(req.params.id);
    res.status(204).send();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};
