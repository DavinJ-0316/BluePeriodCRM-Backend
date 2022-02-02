import express, { Request, Response } from 'express';
import productRouter from './product.route';
import customerRouter from './customer.route';
import userRouter from './user.route';
import orderRouter from './order.route';
import indexRouter from './index.route';
import repaireRouter from './repaire.route';
import invoiceRoute from './invoiceRoute';

const router = express.Router();

router.get('/health', (req: Request, res: Response) => {
  res.send('APIs working');
});
router.get('/', (req: Request, res: Response) => {
  res.send('APIs Index');
});
router.use('/users', userRouter);
router.use('/products', productRouter);
router.use('/customers', customerRouter);
router.use('/orders', orderRouter);
router.use('/invoices', invoiceRoute);
router.use('/repaireOrder', repaireRouter);

export default router;
