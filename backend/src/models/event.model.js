const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

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
}, {
  timestamps: true,
});

module.exports = Event;
