import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';

const error404 = (req: Request, res: Response, next: NextFunction): void => {
    next(createError(404));
};

export default error404;