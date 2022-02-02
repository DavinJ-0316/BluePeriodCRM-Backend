import { Request, Response } from 'express';
import ErrorHandler from '../errorHandler';

const routeError = (req: Request, res: Response)=>{
	throw new ErrorHandler(404, 'Incorrect Url, resources not found.');
};

export default routeError;