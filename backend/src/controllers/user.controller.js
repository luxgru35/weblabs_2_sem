//user.controller.js
import { User } from '../models/index.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';

// Создание пользователя
const createUser = async (req, res, next) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return next(new ValidationError('Имя и email обязательны.'));
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new ValidationError('Email уже существует.');
    }

    const newUser = await User.create({ name, email });
    res.status(201).json({ message: 'Пользователь успешно создан', user: newUser });
  } catch (error) {
    next(error);
  }
};

// Получение пользователя по ID
const getUserById = async (req, res, next) => {
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

export {
  createUser,
  getUserById,
};
