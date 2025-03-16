//index.js
import { Router } from 'express';
import userRoutes from './user.routes.js';
import publicRoutes from './publicRoutes.js';
import eventRoutes from './event.routes.js';
import auth from './auth.js';
import { authenticateJWT, authorizeRole } from '../middlewares/authMiddleware.js';

const router = Router();

// Подключаем маршруты пользователей и мероприятий
router.use('/public', publicRoutes);
router.use('/events', authenticateJWT, eventRoutes); 
router.use('/users', authenticateJWT, authorizeRole(['admin']), userRoutes);
router.use('/auth', auth);
export default router;
