import { Router } from 'express';
import * as EntityController from '../../controllers/entity.controller';
import { validateBody, validateQuery } from '../../middleware/validate';
import { createEntitySchema, updateEntitySchema, searchEntitySchema } from '../../schemas/entity.schema';

const router = Router();

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
