//publicRoutes.js
import { Router } from 'express';
import eventRoutes from './event.routes.js';
const router = Router();
import { authenticateJWT } from '../middlewares/authMiddleware.js';

// Публичный маршрут для получения всех событий
router.use('/events', authenticateJWT, eventRoutes); 
export default router;
