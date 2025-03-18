//index.ts
import { sequelize } from '../../config/db.js';
import User from './user.model.js';
import Event from './event.model.js';

User.hasMany(Event, { foreignKey: 'createdBy', as: 'events' });
Event.belongsTo(User, { foreignKey: 'createdBy', as: 'user' });

export { sequelize, User, Event };
