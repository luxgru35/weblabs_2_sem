//index
import { Router } from 'express';
import userRoutes from './user.routes';
import publicRoutes from './publicRoutes';
import eventRoutes from './event.routes';
import auth from './auth';
import { authenticateJWT, authorizeRole } from '@middlewares/authMiddleware';

const router = Router();

router.use('/public', publicRoutes);
router.use('/events', authenticateJWT, eventRoutes);
router.use('/users', authenticateJWT, authorizeRole(['admin']), userRoutes);
router.use('/auth', auth);
export default router;
