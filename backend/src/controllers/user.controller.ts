// user.controller.ts
import { Request, Response, NextFunction } from 'express';
import { User } from '@models/index';
import { ValidationError, NotFoundError } from '@utils/errors';

interface CreateUserRequestBody {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: 'male' | 'female';
  birthDate: string;
}
interface UpdateUserRequestBody {
  name?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  gender?: 'male' | 'female';
  birthDate?: string;
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
  const {
    name,
    email,
    password,
    role = 'user',
    firstName,
    lastName,
    middleName,
    gender,
    birthDate,
  } = req.body;

  if (
    !name ||
    !email ||
    !password ||
    !firstName ||
    !lastName ||
    !gender ||
    !birthDate
  ) {
    return next(new ValidationError('Обязательные поля не заполнены.'));
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new ValidationError('Email уже существует.');
    }

    const newUser = await User.create({
      name,
      email,
      password,
      role,
      firstName,
      lastName,
      middleName,
      gender,
      birthDate,
    });
    res
      .status(201)
      .json({ message: 'Пользователь успешно создан', user: newUser });
  } catch (error) {
    next(error);
  }
};
const updateUser = async (
  req: Request<{ id: string }, unknown, UpdateUserRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const { name, email, firstName, lastName, middleName, gender, birthDate } =
    req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new NotFoundError('Пользователь не найден.');
    }

    // Проверка прав доступа
    if (req.user?.role !== 'admin' && req.user?.id !== user.id) {
      throw new ValidationError(
        'Недостаточно прав для редактирования этого пользователя.',
      );
    }

    // Если это не админ, запрещаем менять роль и другие защищенные поля
    const isAdmin = req.user?.role === 'admin';
    const updatedFields = {
      ...(name && { name }),
      ...(email && { email }),
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(middleName !== undefined && { middleName }),
      ...(gender && { gender }),
      ...(birthDate && { birthDate }),
      // Админ может обновлять роль, обычный пользователь - нет
      ...(isAdmin && req.body.role && { role: req.body.role }),
    };

    // Проверяем email на уникальность
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new ValidationError(
          'Email уже используется другим пользователем.',
        );
      }
    }

    await user.update(updatedFields);

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      gender: user.gender,
      birthDate: user.birthDate,
    };

    res.status(200).json({
      message: 'Данные пользователя успешно обновлены',
      user: userResponse,
    });
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

export { createUser, getUserById, updateUser };
