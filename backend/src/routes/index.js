// routes/index.js
const express = require('express');
const userRoutes = require('./user.routes');
const public = require('./public');
const auth = require('./auth')
const { authenticateJWT, authorizeRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// Подключаем маршруты пользователей и мероприятий
router.use('/public', public);
router.use('/users', authenticateJWT, authorizeRole(['admin']), userRoutes);
router.use('/auth', auth);
module.exports = router;
