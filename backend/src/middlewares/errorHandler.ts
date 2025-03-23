//errorhandler
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

interface CustomError extends Error {
  statusCode?: number;
}

const errorHandler: ErrorRequestHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error(err);

  if (err.statusCode) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};

export default errorHandler;