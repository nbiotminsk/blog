import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { upload } from '../middleware/upload';
import { parseTemplate } from '../services/templateParser';
import { cleanupFile } from '../utils/fileOps';
import { logger } from '../utils/logger';
import fs from 'fs/promises';
import path from 'path';
import { config } from '../config';

const router = Router();

const parseByPathSchema = z.object({
  path: z.string().min(1, 'Template path is required'),
});

router.post(
  '/templates/parse',
  upload.single('template'),
  async (req: Request, res: Response, next: NextFunction) => {
    let uploadedFilePath: string | undefined;

    try {
      if (req.file) {
        uploadedFilePath = req.file.path;
        const originalFilename = req.file.originalname;
        const mimeType = req.file.mimetype;

        logger.debug(
          { filename: originalFilename, path: uploadedFilePath },
          'Processing uploaded template'
        );

        const result = await parseTemplate(
          uploadedFilePath,
          originalFilename,
          mimeType
        );

        res.status(200).json(result);
      } else if (req.body.path) {
        const validation = parseByPathSchema.safeParse(req.body);

        if (!validation.success) {
          res.status(400).json({
            error: 'Validation failed',
            details: validation.error.issues,
          });
          return;
        }

        const templatePath = validation.data.path;
        const absolutePath = path.isAbsolute(templatePath)
          ? templatePath
          : path.join(config.templateStoragePath, templatePath);

        logger.debug(
          { path: absolutePath },
          'Processing template from storage path'
        );

        await fs.access(absolutePath);

        const filename = path.basename(absolutePath);
        const ext = path.extname(filename).toLowerCase();
        let mimeType = 'application/octet-stream';

        if (ext === '.docx') {
          mimeType =
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        } else if (ext === '.html' || ext === '.htm') {
          mimeType = 'text/html';
        }

        const result = await parseTemplate(absolutePath, filename, mimeType);

        res.status(200).json(result);
      } else {
        res.status(400).json({
          error:
            'Either a file upload (template) or a path in the request body is required',
        });
      }
    } catch (error) {
      logger.error({ error }, 'Template parsing failed');
      next(error);
    } finally {
      if (uploadedFilePath) {
        await cleanupFile(uploadedFilePath);
      }
    }
  }
);

export default router;
