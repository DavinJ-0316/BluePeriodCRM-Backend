import { Router } from 'express';
import { getAllOrders, getOrderById, updateOrderStatusById, createOrder } from '@controllers/orders.controller';

const router = Router();

router.get('/', getAllOrders);
router.post('/', createOrder);
router.put('/:id', updateOrderStatusById);
router.get('/:id', getOrderById);

export default router;
