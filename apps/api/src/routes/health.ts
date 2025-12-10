import { Router } from 'express';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    await req.db.raw('select 1');

    res.status(200).json({
      status: 'ok',
      database: 'connected',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
