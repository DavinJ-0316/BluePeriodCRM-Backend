import { Request, RequestHandler, Response } from 'express';
import Order from '@models/orders.model';
import Customer from '@models/customers.model';
import Product from '@models/products.model';
import { ICustomer } from 'customer';
import { IProduct } from 'order';

/**
 * @swagger
 * /repaireOrder/{id}:
 *  put:
 *    tag: [Orders]
 *    summary: Auto update the Order with lost field, by orderId
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *        example: 'OR-1642285999454'
 *    responses:
 *      200:
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *            example:
 *              orderId: 'OR-1642285999454'
 *
 */

const repaireOrderById: RequestHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const order = await Order.findOne({ orderId: id });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const customerEmail = order.customerInfo.email;
    const foundCustomer = await Customer.findOne({ email: customerEmail });
    if (!foundCustomer) {
      return res.status(404).json({ error: 'customer not found' });
    }
    const { firstName, lastName, email, phone, address } = foundCustomer;

    const name: string = [firstName, lastName].join(' ');
    const newCustomer = { email, name, phone, address };
    const updatedCustomer = await Order.findOneAndUpdate({ orderId: id }, { customerInfo: newCustomer }, { new: true });
    if (!updatedCustomer) {
      return res.status(404).json({ error: 'Customer not updated' });
    }

    const newProducts = await Promise.all(
      order.products.map(async product => {
        const { sku } = await { ...product };
        const output = await Product.findOne({ sku: String(sku) });
        if (!output) {
          res.status(404).json({ error: `${sku} not found` });
        }
        return output;
      }),
    );
    return res.status(200).json(newProducts);
    // const finalOrder = await Order.findOneAndUpdate({ orderId: id }, { products: newProducts }, { new: true });
  } catch (error) {
    res.status(400).json((error as Error).message);
  }
};

const repairAllOrders: RequestHandler = async (req: Request, res: Response) => {
  const order = Order.find();
  return res.status(200).json(order);
};

export { repaireOrderById, repairAllOrders };
