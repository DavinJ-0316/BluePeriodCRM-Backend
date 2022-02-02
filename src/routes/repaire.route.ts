import express from 'express';

import { repaireOrderById, repairAllOrders } from '@controllers/repaireOrder.controller';

const router = express.Router();

router.put('/:id', repaireOrderById);
router.put('/', repairAllOrders);
export default router;
