//server.ts
import env from '@config/env';
import app from './app';
import { sequelize, testConnection } from '@config/db';
import { Request, Response } from 'express';

const PORT = env.PORT || 5000;

const startServer = async (): Promise<void> => {
  try {
    await testConnection();
    await sequelize.sync({ alter: true });

    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (error) {
    console.error('Unable to start the server:', error);
    process.exit(1);
  }
};

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Server is running!' });
});

startServer();
