import { UserAttributes } from '../models/user.model';

declare global {
  namespace Express {
    interface User extends Pick<UserAttributes, 'id' | 'role'> {
      someProperty?: string;
    }

    interface Request {
      user?: User;
    }
  }
}
