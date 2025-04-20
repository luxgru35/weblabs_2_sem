//auth.ts
import { Router, Request, Response, NextFunction } from 'express';
import { compare } from 'bcryptjs';
import User from '@models/user.model';
import jwt from 'jsonwebtoken';
import {
  authenticateJWT,
  authorizeRole,
} from '../middlewares/authMiddleware.js';
import env from '../../config/env.js';

const router = Router();

// Интерфейсы для запроса
interface RegisterRequestBody {
  email: string;
  name: string;
  password: string;
  role?: 'user' | 'admin';
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: 'male' | 'female';
  birthDate: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

// Регистрация пользователя (доступно только `admin`)
router.post(
  '/register',
  authenticateJWT,
  authorizeRole(['admin']),
  async (
    req: Request<unknown, unknown, RegisterRequestBody>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const {
        email,
        name,
        password,
        role,
        firstName,
        lastName,
        gender,
        birthDate,
      } = req.body;
      if (!birthDate || isNaN(Date.parse(birthDate))) {
        res.status(400).json({ message: 'Неверный формат даты рождения' });
        return;
      }
      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        res
          .status(400)
          .json({ message: 'Пользователь с таким email уже существует' });
        return;
      }

      const user = await User.create({
        email,
        name,
        password,
        role: role || 'user',
        firstName: '',
        lastName: '',
        gender: 'male',
        birthDate,
      });

      res.status(201).json({
        message: 'Пользователь успешно зарегистрирован',
        user: {
          name,
          email,
          role: user.role,
          firstName,
          lastName,
          gender,
          birthDate,
        },
      });
    } catch (error) {
      console.error('Error during registration:', error);
      next(error);
    }
  },
);

router.get(
  '/me',
  authenticateJWT,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Неавторизованный запрос' });
        return;
      }

      const user = await User.findByPk(req.user.id, {
        attributes: [
          'id',
          'name',
          'email',
          'role',
          'firstName',
          'lastName',
          'middleName',
          'gender',
          'birthDate',
        ],
      });

      if (!user) {
        res.status(404).json({ message: 'Пользователь не найден' });
        return;
      }

      res.json(user); // Убираем return перед res.json()
    } catch (error) {
      next(error);
    }
  },
);

// Вход пользователя
router.post(
  '/login',
  async (
    req: Request<unknown, unknown, LoginRequestBody>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: 'Email и пароль обязательны' });
        return;
      }

      const user = await User.findOne({ where: { email } });

      if (!user) {
        res.status(404).json({ message: 'Пользователь не найден' });
        return;
      }

      const isMatch = await compare(password, user.password);

      if (!isMatch) {
        res.status(400).json({ message: 'Неверный пароль' });
        return;
      }

      const token = jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, {
        expiresIn: '1h',
      });

      res.json({ token });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
