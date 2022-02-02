import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import createError from 'http-errors';
import logger from '../../config/winston';

const errorHandler: ErrorRequestHandler = (error, req: Request, res: Response, next: NextFunction) => {
    if (error.response) {
    const { data } = error.response;
      if (data.code === '429') {
        logger.warn(data.message);
        return createError(503);
      }
      createError(Number.parseInt(data.code, 10));
    } else if (error.request) {
      logger.warn(error.request);
    } else {
      logger.error(error.message);
    }
    logger.error(error.stack);
    return createError(500);
  };
  
  export default errorHandler

