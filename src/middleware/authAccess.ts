import { Request, Response, NextFunction } from 'express';
import User from '@models/users.model';
import { validateToken } from '@utils/jwt';

const authValidator = async (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.header('Authorization') as string;
  const tokenArray = authorizationHeader.split(' ');
  const token = tokenArray[1];

  if (!authorizationHeader) {
    return res.status(401).json({ error: 'You are not logged in! Please login to get access' });
  }

  if (tokenArray[0] !== 'Bearer' || tokenArray.length !== 2) {
    return res.status(401).json({ error: 'Please provide token' });
  }

  const decode = validateToken(token);

  try {
    const currentUser = await User.findOne({ userId: decode.id });

    if (!currentUser) {
      return res.status(401).json({ error: 'The user belonging to this token does no longer exist' });
    }

    req.body.user = currentUser;
  } catch (error) {
    return res.status(400).json((error as Error).message);
  }
  return next();
};

const isAdmin =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.body.user.role)) {
      return res.status(403).json({ error: 'You do not have permission to perform this action' });
    }
    return next();
  };

export { authValidator, isAdmin };
