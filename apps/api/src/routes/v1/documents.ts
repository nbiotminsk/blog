import { Router } from 'express';
import * as DocumentController from '../../controllers/document.controller';
import { validateBody } from '../../middleware/validate';
import { generateDocumentSchema } from '../../schemas/document.schema';

const router = Router();

/**
 * @swagger
 * /documents/generate:
 *   post:
 *     summary: Generate document
 *     tags: [Documents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               template_id:
 *                 type: string
 *               entity_id:
 *                 type: string
 *               payload:
 *                 type: object
 *     responses:
 *       200:
 *         description: Document generated
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 */
router.post('/generate', validateBody(generateDocumentSchema), DocumentController.generateDocument);

export default router;
