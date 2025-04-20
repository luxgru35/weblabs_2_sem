import { Router } from 'express';
import {
  createUser,
  getUserById,
  updateUser,
} from '@controllers/user.controller';
import { authenticateJWT, authorizeRole } from '@middlewares/authMiddleware';

const router = Router();

router.post('/', authenticateJWT, authorizeRole(['admin']), createUser);

router.get('/:id', authenticateJWT, authorizeRole(['admin']), getUserById);

router.put('/:id', authenticateJWT, updateUser);

export default router;
