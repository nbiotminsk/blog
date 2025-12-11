import { Router } from 'express';
import * as EntityController from '../../controllers/entity.controller';
import { validateBody, validateQuery } from '../../middleware/validate';
import { createEntitySchema, updateEntitySchema, searchEntitySchema, listDuplicatesSchema, checkDuplicatesSchema, mergeEntitiesSchema } from '../../schemas/entity.schema';

const router = Router();

/**
 * @swagger
 * /entities:
 *   get:
 *     summary: List entities
 *     tags: [Entities]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', EntityController.listEntities);

/**
 * @swagger
 * /entities:
 *   post:
 *     summary: Create a new entity
 *     tags: [Entities]
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', validateBody(createEntitySchema), EntityController.createEntity);

/**
 * @swagger
 * /entities/duplicates:
 *   get:
 *     summary: List duplicate entity pairs
 *     tags: [Entities]
 *     parameters:
 *       - in: query
 *         name: threshold
 *         schema:
 *           type: number
 *           minimum: 0
 *           maximum: 1
 *           default: 0.5
 *         description: Similarity threshold (0-1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 20
 *         description: Number of results per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/duplicates', validateQuery(listDuplicatesSchema), EntityController.listDuplicates);

/**
 * @swagger
 * /entities/duplicates/check:
 *   get:
 *     summary: Check for duplicates of a specific entity
 *     tags: [Entities]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Entity ID to check
 *       - in: query
 *         name: threshold
 *         schema:
 *           type: number
 *           minimum: 0
 *           maximum: 1
 *           default: 0.5
 *         description: Similarity threshold (0-1)
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Entity not found
 */
router.get('/duplicates/check', validateQuery(checkDuplicatesSchema), EntityController.checkDuplicates);

/**
 * @swagger
 * /entities/merge:
 *   post:
 *     summary: Merge two entities
 *     tags: [Entities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - primaryEntityId
 *               - duplicateEntityId
 *               - mergedFields
 *             properties:
 *               primaryEntityId:
 *                 type: string
 *                 format: uuid
 *               duplicateEntityId:
 *                 type: string
 *                 format: uuid
 *               mergedFields:
 *                 type: object
 *               categoryIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Merge successful
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Entity not found
 */
router.post('/merge', validateBody(mergeEntitiesSchema), EntityController.mergeEntities);

/**
 * @swagger
 * /entities/search:
 *   get:
 *     summary: Search entities
 *     tags: [Entities]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/search', validateQuery(searchEntitySchema), EntityController.searchEntities);

/**
 * @swagger
 * /entities/{id}:
 *   get:
 *     summary: Get entity
 *     tags: [Entities]
 *     responses:
 *       200:
 *         description: Success
 *   patch:
 *     summary: Update entity
 *     tags: [Entities]
 *     responses:
 *       200:
 *         description: Success
 *   delete:
 *     summary: Delete entity
 *     tags: [Entities]
 *     responses:
 *       204:
 *         description: Success
 */
router.get('/:id', EntityController.getEntity);
router.patch('/:id', validateBody(updateEntitySchema), EntityController.updateEntity);
router.delete('/:id', EntityController.deleteEntity);

export default router;
