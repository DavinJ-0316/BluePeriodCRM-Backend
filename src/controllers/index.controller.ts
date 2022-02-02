import { Request, Response } from 'express';

const index = (req: Request, res: Response): void => {
  res.send('index');
};

export default index;
