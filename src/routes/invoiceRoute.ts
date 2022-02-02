import { Router } from 'express';
import { getAllInvoices, getInvoiceById } from '@controllers/invoices.controller';

const router = Router();

router.get('/', getAllInvoices);
router.get('/:id', getInvoiceById);

export default router;
