import { Router } from 'express';
import * as TemplateController from '../../controllers/template.controller';
import { validateBody } from '../../middleware/validate';
import { createTemplateSchema } from '../../schemas/template.schema';
import { upload } from '../../middleware/upload';

const router = Router();

/**
 * @swagger
 * /templates:
 *   post:
 *     summary: Create template
 *     tags: [Templates]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *               format:
 *                 type: string
 *                 enum: [docx, html]
 *     responses:
 *       201:
 *         description: Created
 *   get:
 *     summary: List templates
 *     tags: [Templates]
 *     responses:
 *       200:
 *         description: Success
 */
router.post('/', upload.single('file'), validateBody(createTemplateSchema), TemplateController.createTemplate);
router.get('/', TemplateController.listTemplates);

/**
 * @swagger
 * /templates/{id}:
 *   get:
 *     summary: Get template
 *     tags: [Templates]
 *     responses:
 *       200:
 *         description: Success
 *   delete:
 *     summary: Delete template
 *     tags: [Templates]
 *     responses:
 *       204:
 *         description: Success
 */
router.get('/:id', TemplateController.getTemplate);
router.delete('/:id', TemplateController.deleteTemplate);

export default router;
