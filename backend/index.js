const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
const fs = require('fs');
const { sequelize } = require('./config/db'); 
const eventsRouter = require('./config/events');
const userRoutes = require('./config/users');
const errorHandler = require('./config/errorHandler');
const morgan = require('morgan');
dotenv.config();

const app = express();

const swaggerDocument = yaml.load(fs.readFileSync('./swagger.yaml', 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('[METHOD] :method :url :status :response-time ms'));
app.use('/api', eventsRouter);
app.use('/api', userRoutes);
app.use(errorHandler);

// Тестовый маршрут
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
    if (err) {
      console.error('Error starting server:', err);
      process.exit(1); // Выход с ошибкой
    } else {
      console.log(`Server is running on port ${PORT}`);
    }
});

// Синхронизация моделей с базой данных
sequelize.sync({ alter: true })
  .then(() => {
  console.log('Модели синхронизированы с базой данных');
});

// Тестовое подключение к базе данных
sequelize.authenticate().then(() => {
  console.log('Database connected successfully.');
}).catch((err) => {
  console.error('Unable to connect to the database:', err);
});
