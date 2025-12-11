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

/**
 * @swagger
 * /documents:
 *   get:
 *     summary: List document records
 *     tags: [Documents]
 *     parameters:
 *       - in: query
 *         name: entity_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: template_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, completed, failed]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', DocumentController.listDocumentRecords);

/**
 * @swagger
 * /documents/{id}:
 *   get:
 *     summary: Get document record
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/:id', DocumentController.getDocumentRecord);

export default router;
