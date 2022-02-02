import { Request, RequestHandler, Response } from 'express';
import Invoice from '@models/invoices.model';
import IInvoice from 'invoice';

/**
 * @swagger
 * /invoices:
 *  get:
 *    summary: return all Invoices
 *    tags: [Invoices]
 *    responses:
 *      200:
 *        description:  array of Invoices Objects should be returned
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 */
const getAllInvoices: RequestHandler = async (req: Request, res: Response) => {
  const invoices = await Invoice.find({}).exec();
  return res.status(200).json(invoices);
};

/**
 * @swagger
 * /invoices/{id}:
 *  get:
 *    summary: return details of Invoice by invoiceId
 *    tags: [Invoices]
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *        example: 'IN-1642286050591'
 *    responses:
 *      200:
 *        description:  Selected Invoice should be returned
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *            example:
 *              __v: 0
 *      '404':
 *        description: Invoice Not Found
 *        content:
 *          appplication/json:
 *            schema:
 *              type: object
 *            example: 'OR-1642286050591 not found'
 */
const getInvoiceById: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const invoiceById = await Invoice.findOne({ invoiceId: String(id) });
    if (!invoiceById) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    return res.status(200).json(invoiceById);
  } catch (e) {
    res.status(400).json((e as Error).message);
  }
};

// TODO: send invoice by id to customer.email

export { getAllInvoices, getInvoiceById };
