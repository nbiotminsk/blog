import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { upload } from '../middleware/upload';
import { renderDocument } from '../services/documentRenderer';
import { cleanupFile } from '../utils/fileOps';
import { logger } from '../utils/logger';
import fs from 'fs/promises';
import path from 'path';
import { config } from '../config';

const router = Router();

const renderRequestSchema = z.object({
  data: z.record(z.string(), z.unknown()),
  path: z.string().optional(),
  convertTo: z.enum(['pdf', 'docx', 'odt', 'html']).optional(),
});

router.post(
  '/documents/render',
  upload.single('template'),
  async (req: Request, res: Response, next: NextFunction) => {
    let uploadedFilePath: string | undefined;
    let tempOutputPath: string | undefined;

    try {
      const bodyData = typeof req.body.data === 'string' 
        ? JSON.parse(req.body.data) 
        : req.body.data;
      
      const convertTo = req.body.convertTo;
      
      const validation = renderRequestSchema.safeParse({
        data: bodyData,
        path: req.body.path,
        convertTo: convertTo,
      });

      if (!validation.success) {
        res.status(400).json({
          error: 'Validation failed',
          details: validation.error.issues,
        });
        return;
      }

      const { data, path: templatePath, convertTo: convertToFormat } = validation.data;
      let templateFilePath: string;
      let originalFilename: string;

      if (req.file) {
        uploadedFilePath = req.file.path;
        templateFilePath = uploadedFilePath;
        originalFilename = req.file.originalname;

        logger.debug(
          { filename: originalFilename, path: uploadedFilePath },
          'Processing uploaded template for rendering'
        );
      } else if (templatePath) {
        const absolutePath = path.isAbsolute(templatePath)
          ? templatePath
          : path.join(config.templateStoragePath, templatePath);

        logger.debug(
          { path: absolutePath },
          'Processing template from storage path for rendering'
        );

        await fs.access(absolutePath);
        templateFilePath = absolutePath;
        originalFilename = path.basename(absolutePath);
      } else {
        res.status(400).json({
          error:
            'Either a file upload (template) or a path in the request body is required',
        });
        return;
      }

      const renderOptions = convertToFormat ? { convertTo: convertToFormat } : undefined;

      const result = await renderDocument(
        templateFilePath,
        data,
        originalFilename,
        renderOptions
      );

      res.status(200).json({
        filename: result.filename,
        mimeType: result.mimeType,
        size: result.buffer.length,
        document: result.base64,
      });
    } catch (error) {
      logger.error({ error }, 'Document rendering failed');
      next(error);
    } finally {
      if (uploadedFilePath) {
        await cleanupFile(uploadedFilePath);
      }
      if (tempOutputPath) {
        await cleanupFile(tempOutputPath);
      }
    }
  }
);

export default router;
