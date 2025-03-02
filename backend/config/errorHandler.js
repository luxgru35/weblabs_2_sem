// middlewares/errorHandler.js
module.exports = (err, req, res, next) => {
    console.error(err);
  
    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }
  
    // Если ошибка не кастомная, возвращаем 500
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  };
  