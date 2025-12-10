import { Router } from 'express';

import healthRoute from './health';
import entitiesRoutes from './v1/entities';
import categoriesRoutes from './v1/categories';
import templatesRoutes from './v1/templates';
import documentsRoutes from './v1/documents';

const router = Router();

router.use('/health', healthRoute);
router.use('/v1/entities', entitiesRoutes);
router.use('/v1/categories', categoriesRoutes);
router.use('/v1/templates', templatesRoutes);
router.use('/v1/documents', documentsRoutes);

export default router;
