// user.controller.ts
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/index.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';

interface CreateUserRequestBody {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}
// Создание пользователя
const createUser = async (
  req: Request<
    Record<string, never>,
    Record<string, never>,
    CreateUserRequestBody
  >,
  res: Response,
  next: NextFunction,
) => {
  const { name, email, password, role = 'user' } = req.body; // Установлен default для role

  if (!name || !email || !password) {
    return next(new ValidationError('Имя, email и пароль обязательны.'));
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new ValidationError('Email уже существует.');
    }

    const newUser = await User.create({ name, email, password, role });
    res
      .status(201)
      .json({ message: 'Пользователь успешно создан', user: newUser });
  } catch (error) {
    next(error);
  }
};

// Получение пользователя по ID
const getUserById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new NotFoundError('Пользователь не найден.');
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export { createUser, getUserById };
