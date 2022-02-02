import { Request, Response } from 'express';
import { HttpError } from 'http-errors';

const otherError = (err: HttpError, req: Request, res: Response) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.status(err.status || 500);
    res.send("error");
  }

export default otherError;
