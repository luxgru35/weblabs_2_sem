// morganLogger.ts
import morgan from 'morgan';
import { Request, Response, NextFunction } from 'express';

const format = ':method :url :status :response-time ms';

const morganLogger = (req: Request, res: Response, next: NextFunction) => {
  morgan(format)(req, res, next);
};

export default morganLogger;
