const express = require('express');
const eventRoutes = require('./event.routes');
const router = express.Router();
const { authenticateJWT } = require('../middlewares/authMiddleware');

// Публичный маршрут для получения всех событий
router.use('/events', authenticateJWT, eventRoutes); 
module.exports = router;
