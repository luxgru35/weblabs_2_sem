//event.routes
import { Router } from 'express';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsByUserId,
} from '@controllers/event.controller';

const router = Router();

router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.get('/user/:id', getEventsByUserId);
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

export default router;
