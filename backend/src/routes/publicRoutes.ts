//publicRoutes.js
import { Router } from 'express';
import { getAllEvents, getEventById } from '@controllers/event.controller';
const router = Router();

router.get('/events', getAllEvents);
router.get('/events/:id', getEventById);
export default router;
