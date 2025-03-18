// db.ts
import { Sequelize } from 'sequelize';
import env from './env.js'; // Импортируем env-переменные

const sequelize = new Sequelize(
  env.DB_NAME, // Используем env-переменные
  env.DB_USER,
  env.DB_PASSWORD,
  {
    host: env.DB_HOST,
    dialect: 'postgres',
    port: parseInt(env.DB_PORT, 10), // Преобразуем порт в число
    logging: false, // Отключаем SQL-логи в консоли
  },
);

const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export { sequelize, testConnection };
