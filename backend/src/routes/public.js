const express = require('express');
const eventRoutes = require('./event.routes');
const router = express.Router();

// Публичный маршрут для получения всех событий
router.use('/events', eventRoutes); 
module.exports = router;
