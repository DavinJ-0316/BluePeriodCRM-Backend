import express from 'express';

import {
  getAllCustomers,
  getCustomerByEmail,
  deleteCustomerByEmail,
  updateCustomerByEmail,
  createNewCustomer,
} from '@controllers/customers.controller';

const router = express.Router();

router.get('/', getAllCustomers);
router.post('/', createNewCustomer);
router.put('/:email', updateCustomerByEmail);
router.delete('/:email', deleteCustomerByEmail);
router.get('/:email', getCustomerByEmail);
export default router;
