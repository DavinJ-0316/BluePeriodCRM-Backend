import { Request, RequestHandler, Response } from 'express';
import Order from '@models/orders.model';
import Customer from '@models/customers.model';
import Product from '@models/products.model';
import Invoice from '@models/invoices.model';
import IInvoice from 'invoice';
import IOrder, { IProduct } from '../types/order';

/**
 * @swagger
 * /orders:
 *  post:
 *    tags: [Orders]
 *    summary: create a new Order, Only provide for 3rd party API
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *          example:
 *            customerInfo:
 *              name: James Rock
 *              email: jamesr@gmail.com
 *              phone: 0413 222 111
 *              address:
 *                street: 10 Eva Street, Ultimo
 *                city: Ultimo
 *                state: NSW
 *                postcode: 2222
 *            products:
 *              - sku: 0948c595-5766-4621-893a-a4b56553aa62
 *                productName: Nintendo Switch
 *                description: Best selling Mobile Console from Nintendo
 *                quantity: 3
 *                price: 539
 *              - sku: 53d08caa-d952-422c-9baf-26539f21e3c1
 *                productName: Play Station 5
 *                description: The World's BEST leading next generation gaming station
 *                quantity: 2
 *                price: 1200
 *              - sku: e991208a-6c7c-4f21-ad7d-1d060c2b9495
 *                productName: Nvidia RTX 3090
 *                description: The graphic card you never brought
 *                quantity: 1
 *                price: 539
 *    responses:
 *      '201':
 *        description: Created
 *        content:
 *          appplication/json:
 *            schema:
 *              type: object
 *            example:
 *              customerInfo:
 *                name: James Rock
 *                email: ante@aol.net
 *              products:
 *                - sku: 0948c595-5766-4621-893a-a4b56553aa62
 *                  quantity: 2
 *                  price: 539
 *                  _id: 61e3514093ae6034b2aebb75
 *                - sku: 53d08caa-d952-422c-9baf-26539f21e3c1
 *                  quantity: 2
 *                  price: 1010
 *                  _id: 61e3514093ae6034b2aebb76
 *              _id: 61e3514093ae6034b2aebb74
 *              orderId: OR-1642287424132
 *              dateCreated: '2022-01-15T22:57:04.132Z'
 *              status: PENDING
 *              __v: 0
 *      '400':
 *        description: Customer not exist
 *        content:
 *          appplication/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  exmaple: 'Customer James Rock, ante@aol.net doesn not exist. '
 */
const createOrder: RequestHandler = async (req: Request, res: Response) => {
  const { customerInfo, products } = req.body;

  if (!customerInfo || !products || products.length === 0) {
    return res.status(400).json({ error: 'input fields cannot be empty.' });
  }
  if (!Customer.findOne({ email: `${customerInfo.email}` })) {
    return res.status(400).json({ error: `Customer ${customerInfo.name}, ${customerInfo.email} does not exist.` });
  }

  try {
    const order: IOrder = await Order.create({
      customerInfo,
      products,
    });

    return res.status(201).json(order);
  } catch (error) {
    return res.status(403).json(error as Error);
  }
};

/**
 * @swagger
 * /orders:
 *  get:
 *    summary: return all Orders
 *    tags: [Orders]
 *    responses:
 *      200:
 *        description:  array of Orders Objects should be returned
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *            example:
 *              - customerInfo:
 *                  name: James Rock
 *                  email: ante@aol.net
 *                products:
 *                  - sku: 0948c595-5766-4621-893a-a4b56553aa62
 *                    quantity: 2
 *                    price: 539
 *                    _id: 61e3514093ae6034b2aebb75
 *                  - sku: 53d08caa-d952-422c-9baf-26539f21e3c1
 *                    quantity: 2
 *                    price: 1010
 *                    _id: 61e3514093ae6034b2aebb76
 *                _id: 61e3514093ae6034b2aebb74
 *                orderId: OR-1642287424132
 *                dateCreated: '2022-01-15T22:57:04.132Z'
 *                status: PENDING
 *                __v: 0
 *              - customerInfo:
 *                  name: James Rock
 *                  email: ante@aol.net
 *                products:
 *                  - sku: 0948c595-5766-4621-893a-a4b56553aa62
 *                    quantity: 2
 *                    price: 539
 *                    _id: 61e3514093ae6034b2aebb75
 *                  - sku: 53d08caa-d952-422c-9baf-26539f21e3c1
 *                    quantity: 2
 *                    price: 1010
 *                    _id: 61e3514093ae6034b2aebb76
 *                _id: 61e3514093ae6034b2aebb74
 *                orderId: OR-1642287424132
 *                dateCreated: '2022-01-15T22:57:04.132Z'
 *                status: PENDING
 *                __v: 0
 */
const getAllOrders: RequestHandler = async (req: Request, res: Response) => {
  const orders = await Order.find({}).exec();
  return res.status(200).json(orders);
};

/**
 * @swagger
 * /orders/{id}:
 *  get:
 *    summary: return details of Orders by orderId
 *    tags: [Orders]
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *        example: 'OR-1642286050591'
 *    responses:
 *      200:
 *        description:  Selected Order should be returned
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *            example:
 *              customerInfo:
 *                name: Samztz
 *                email: ante@aol.net
 *              _id: 61e34be239513c2fa3b53baf
 *              products:
 *                - sku: 0948c595-5766-4621-893a-a4b56553aa62
 *                  quantity: 2
 *                  price: 539123
 *                  _id: 61e34be239513c2fa3b53bb0
 *                - sku: 53d08caa-d952-422c-9baf-26539f21e3c1
 *                  quantity: 2
 *                  price: 5391
 *                  _id: 61e34be239513c2fa3b53bb1
 *              orderId: OR-1642286050591
 *              dateCreated: '2022-01-15T22:34:10.591Z'
 *              status: PENDING
 *              __v: 0
 *      '404':
 *        description: Order Not Found
 *        content:
 *          appplication/json:
 *            schema:
 *              type: object
 *            example: 'OR-1642286050591 not found'
 */
const getOrderById: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const orderById = await Order.findOne({ orderId: String(id) });
    if (!orderById) {
      return res.status(404).json({ error: 'order not found' });
    }
    return res.status(200).json(orderById);
  } catch (e) {
    res.status(400).json((e as Error).message);
  }
};

/**
 * @swagger
 * /orders/{id}:
 *  put:
 *    tags: [Orders]
 *    summary:  Compelete, Reject, Cancel Order
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *        example: 'OR-1642286050591'
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *          example:
 *            status: 'COMPLETED'
 *    responses:
 *      '200':
 *        description:  Selected Order should be returned
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *            example:
 *              customerInfo:
 *                name: Samztz
 *                email: ante@aol.net
 *              _id: 61e34be239513c2fa3b53baf
 *              products:
 *                - sku: 0948c595-5766-4621-893a-a4b56553aa62
 *                  quantity: 2
 *                  price: 539123
 *                  _id: 61e34be239513c2fa3b53bb0
 *                - sku: 53d08caa-d952-422c-9baf-26539f21e3c1
 *                  quantity: 2
 *                  price: 5391
 *                  _id: 61e34be239513c2fa3b53bb1
 *              orderId: OR-1642286050591
 *              dateCreated: '2022-01-15T22:34:10.591Z'
 *              status: COMPLETED
 *              __v: 0
 *
 */
const updateOrderStatusById: RequestHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['COMPLETED', 'CANCELED', 'REJECTED'].includes(status)) {
    return res.status(400).json({ error: 'You are Only Allowed setting Status to COPMELTED, REJECTED, CANCELED' });
  }

  // check if existing order exist
  const existOrder = await Order.findOne({ orderId: id }).exec();

  if (!existOrder) return res.status(404).json({ error: 'order not found.' });

  // check if order status is pending
  if (existOrder.status !== 'PENDING')
    return res.status(400).json({ error: 'You are Only Allowed to modifed status of PENGDING orders' });

  // If trying to complete Order, checkeck if inventory full filled
  if (status === 'COMPLETED') {
    const { products, customerInfo, dateCreated, orderId } = { ...existOrder.toJSON() };
    const customer = await Customer.findOne({ email: customerInfo.email });
    const totalPrice = products.reduce((prev, p) => prev + p.price * p.quantity, 0);
    // Checkif customer is valid in database
    if (!customer)
      return res.status(404).json({ error: `Customer Corresponding to email: ${customerInfo.email} not found` });
    const skuProducts: { [key: string]: any } = products.reduce(
      (prev, product: IProduct) => Object.assign(prev, { [product.sku]: product }),
      {},
    );
    const SKUs: string[] = products.map(p => p.sku);
    const result = await Product.find({ sku: { $in: SKUs } }).lean();
    for (let i = 0; i < result.length; i += 1) {
      if (skuProducts[result[i].sku].quantity > result[i].quantity)
        return res.status(400).json({
          error: `${result[i].productName} has quantity: [${result[i].quantity}] is less than required quantity: [${
            skuProducts[result[i].sku].quantity
          }] .`,
        });
    }
    // Veryfication passed

    // reduce inventory
    existOrder.products.forEach(async product => {
      await Product.findOneAndUpdate({ sku: String(product.sku) }, { $inc: { quantity: -product.quantity } });
    });

    // create new Invoice
    const invoice: IInvoice = await Invoice.create({
      customerInfo,
      dateCreated,
      orderId,
      products,
    });

    // modify customer data
    await Customer.findOneAndUpdate(
      { email: customerInfo.email },
      { $inc: { orderAccumulation: 1, totalSpent: totalPrice }, invoiceId: invoice.invoiceId },
    );
    const order = await Order.findOneAndUpdate(
      { orderId: id },
      { status, invoiceId: invoice.invoiceId },
      { new: true },
    );
    return res.status(200).json(order);
  }
  const order = await Order.findOneAndUpdate({ orderId: id }, { status }, { new: true });
  return res.status(200).json(order);
};

export { getAllOrders, getOrderById, updateOrderStatusById, createOrder };
