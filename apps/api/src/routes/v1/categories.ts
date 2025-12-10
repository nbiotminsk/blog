import { Router } from 'express';
import * as CategoryController from '../../controllers/category.controller';
import { validateBody } from '../../middleware/validate';
import { createCategorySchema, updateCategorySchema } from '../../schemas/category.schema';

const router = Router();

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create category
 *     tags: [Categories]
 *     responses:
 *       201:
 *         description: Created
 *   get:
 *     summary: List categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Success
 */
router.post('/', validateBody(createCategorySchema), CategoryController.createCategory);
router.get('/', CategoryController.listCategories);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get category
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Success
 *   patch:
 *     summary: Update category
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Success
 *   delete:
 *     summary: Delete category
 *     tags: [Categories]
 *     responses:
 *       204:
 *         description: Success
 */
router.get('/:id', CategoryController.getCategory);
router.patch('/:id', validateBody(updateCategorySchema), CategoryController.updateCategory);
router.delete('/:id', CategoryController.deleteCategory);

export default router;
