//event.controller
import { Request, Response, NextFunction } from 'express';
import { Event, User } from '@models/index';
import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
} from '../utils/errors.js';

// Получение списка всех мероприятий
export const getAllEvents = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (error) {
    next(error);
  }
};

// Получение мероприятия по ID
const getEventById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
    const event = await Event.findByPk(id, {
      include: {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'role'],
      },
    });
    if (!event) {
      throw new NotFoundError('Мероприятие не найдено');
    }
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

// Создание мероприятия
const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Не авторизован' });
    return;
  }

  const { title, description, date, category } = req.body;

  if (!title || !date || !category) {
    next(new ValidationError('Обязательные данные не переданы'));
    return;
  }

  try {
    const event = await Event.create({
      title,
      description,
      date,
      category,
      createdBy: req.user.id,
    });
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

// Обновление мероприятия
const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Не авторизован' });
    return;
  }

  const { id } = req.params;
  const { title, description, date, category } = req.body;

  if (!title || !date || !category) {
    next(new ValidationError('Обязательные данные не переданы'));
    return;
  }

  try {
    const event = await Event.findByPk(id);
    if (!event) {
      throw new NotFoundError('Мероприятие не найдено');
    }
    if (req.user.role !== 'admin' && event.createdBy !== req.user.id) {
      next(new ForbiddenError('Можно редактировать только свои события'));
      return;
    }
    await event.update({ title, description, date, category });
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Не авторизован' });
    return;
  }

  const { id } = req.params;
  try {
    const event = await Event.findByPk(id);
    if (!event) {
      throw new NotFoundError('Мероприятие не найдено');
    }
    await event.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export { getEventById, createEvent, updateEvent, deleteEvent };
