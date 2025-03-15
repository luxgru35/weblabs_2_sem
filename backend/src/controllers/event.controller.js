//event.controller.js
import { Event, User } from '../models/index.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';

// Получение списка всех мероприятий
const getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.findAll({
      include: {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email'],
      },
    });
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

// Получение мероприятия по ID
const getEventById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const event = await Event.findByPk(id, {
      include: {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email'],
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
const createEvent = async (req, res, next) => {
  const { title, description, date, category} = req.body;

  if (!title || !date || !category) {
    return next(new ValidationError('Обязательные данные не переданы'));
  }
  try {
    const event = await Event.create({ title, description, date, category, createdBy: req.user.id });
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

// Обновление мероприятия
const updateEvent = async (req, res, next) => {
  const { id } = req.params;
  const { title, description, date, category} = req.body;

  if (!title || !date || !category) {
    return next(new ValidationError('Обязательные данные не переданы'));
  }

  try {
    const event = await Event.findByPk(id);
    if (!event) {
      throw new NotFoundError('Мероприятие не найдено');
    }
    if (req.user.role !== 'admin' && event.createdBy !== req.user.id) {
      return next(new ForbiddenError('Можно редактировать только свои события'));
    }
    await event.update({ title, description, date, category});
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

// Удаление мероприятия
const deleteEvent = async (req, res, next) => {
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

export {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
