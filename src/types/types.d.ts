import { User } from '@models/users.model';

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
