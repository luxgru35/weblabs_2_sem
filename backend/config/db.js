const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Настройка подключения
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
  }
);

// Определение модели User
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true, // Валидация email
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false,
  },
});


User.addHook('beforeCreate', (user) => {
  if (!user.email || user.email.trim() === '') {
    throw new Error('Email is required');
  }
});

// Определение модели Event
const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('концерт', 'лекция', 'выставка'),
    allowNull: false,
    defaultValue: 'лекция',
  },
  createdBy: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
});


Event.addHook('beforeCreate', (event) => {
  if (!event.title || event.title.trim() === '') {
    throw new Error('Title is required');
  }
});

// Связь между моделями
User.hasMany(Event, {
  foreignKey: 'createdBy',
  as: 'events',
});

Event.belongsTo(User, {
  foreignKey: 'createdBy',
  as: 'user',
});

// Функция для проверки соединения с БД
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

// Синхронизация базы данных
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Таблицы успешно синхронизированы!');
  })
  .catch((err) => {
    console.error('Ошибка при синхронизации:', err);
  });

module.exports = { sequelize, User, Event, testConnection };
