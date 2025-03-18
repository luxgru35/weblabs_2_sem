import { Request, Response, NextFunction, RequestHandler } from 'express';
import passport from '../../config/passport.js';

const authenticateJWT: RequestHandler = passport.authenticate('jwt', {
  session: false,
});

const authorizeRole = (roles: string[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Доступ запрещен' });
      return;
    }
    next();
  };
};

export { authenticateJWT, authorizeRole };
