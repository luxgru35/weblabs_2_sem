// routes/index.js
const express = require('express');
const userRoutes = require('./user.routes');
const public = require('./public');
const auth = require('./auth')
const passport = require('passport');

const router = express.Router();

// Подключаем маршруты пользователей и мероприятий
router.use('/public', public);
router.use('/users', passport.authenticate('jwt', { session:false}), userRoutes);
router.use('/auth', auth);
module.exports = router;
