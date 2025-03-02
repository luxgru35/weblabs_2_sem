//events.js
const express = require('express');
const { Event, User } = require('./db');
const { ValidationError, NotFoundError } = require('./errors');
const router = express.Router();

// Получение списка всех мероприятий
router.get('/events', async (req, res, next) => {
  try {
    const events = await Event.findAll({
      include: {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email'], // Какие поля пользователя показывать
      },
    });
    res.status(200).json(events);
  } catch (error) {
    next(error); // Переход к централизованному обработчику ошибок
  }
});

// Получение одного мероприятия по ID
router.get('/events/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const event = await Event.findByPk(id, {
      include: {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email'],
      },
    });
    if (event) {
      res.status(200).json(event);
    } else {
      throw new NotFoundError('Мероприятие не найдено'); // Используем кастомную ошибку
    }
  } catch (error) {
    next(error); // Переход к централизованному обработчику ошибок
  }
});

// Создание мероприятия
router.post('/events', async (req, res, next) => {
  const { title, description, date, category, createdBy } = req.body;

  if (!title || !date || !category || !createdBy) {
    return next(new ValidationError('Обязательные данные не переданы')); // Используем кастомную ошибку
  }

  try {
    const event = await Event.create({
      title,
      description,
      date,
      category,
      createdBy,
    });
    res.status(201).json(event);
  } catch (error) {
    next(error); // Переход к централизованному обработчику ошибок
  }
});

// Обновление мероприятия
router.put('/events/:id', async (req, res, next) => {
  const { id } = req.params;
  const { title, description, date, category, createdBy } = req.body;

  if (!title || !date || !category || !createdBy) {
    return next(new ValidationError('Обязательные данные не переданы')); // Используем кастомную ошибку
  }

  try {
    const event = await Event.findByPk(id);
    if (event) {
      await event.update({ title, description, date, category, createdBy });
      res.status(200).json(event);
    } else {
      throw new NotFoundError('Мероприятие не найдено'); // Используем кастомную ошибку
    }
  } catch (error) {
    next(error); // Переход к централизованному обработчику ошибок
  }
});

// Удаление мероприятия
router.delete('/events/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const event = await Event.findByPk(id);
    if (event) {
      await event.destroy();
      res.status(204).send();
    } else {
      throw new NotFoundError('Мероприятие не найдено'); // Используем кастомную ошибку
    }
  } catch (error) {
    next(error); // Переход к централизованному обработчику ошибок
  }
});

module.exports = router;
