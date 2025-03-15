//user.model.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/db.js';
import { hash } from 'bcryptjs';

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
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    allowNull: false,
    defaultValue: 'user',
}
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      const hashedPassword = await hash(user.password, 10);
      user.password = hashedPassword;
    },
  },
});

export default User;
