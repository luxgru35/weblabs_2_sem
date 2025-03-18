// event.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '@config/db';

interface EventAttributes {
  id: number;
  title: string;
  description: string | null;
  date: Date;
  category: 'концерт' | 'лекция' | 'выставка';
  createdBy: number;
}

class Event
  extends Model<EventAttributes, Optional<EventAttributes, 'id'>>
  implements EventAttributes
{
  public id!: number;
  public title!: string;
  public description!: string | null;
  public date!: Date;
  public category!: 'концерт' | 'лекция' | 'выставка';
  public createdBy!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Event.init(
  {
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
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Event',
    timestamps: true,
  },
);

export default Event;
