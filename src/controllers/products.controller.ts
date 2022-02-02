import { Request, RequestHandler, Response } from 'express';
import Product from '@models/products.model';
import { IProduct } from '../types/products';

/**
 * @swagger
 * /products:
 *  get:
 *    summary: return all Products, remove  notification, __version
 *    tags: [Products]
 *    responses:
 *      200:
 *        description:  array of Product Objects should be returned
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *            example:
 *              - sku: '507e9797-d9c9-43a2-ac0c-34f349ee7ba7'
 *                productName: 'Healthcare Product X'
 *                category: 'Healthcare'
 *                price: 9
 *                quantity: 7
 *              - sku: '507e9797-d9c9-43a2-ac0c-34f349ee7ba9'
 *                productName: 'Healthcare Product Y'
 *                category: 'Healthcare'
 *                price: 3
 *                quantity: 6
 *              - sku: '507e9797-d9c9-43a2-ac0c-34f349ee7ba1'
 *                productName: 'Healthcare Product Z'
 *                category: 'Healthcare'
 *                price: 5
 *                quantity: 2
 */

const getAllProducts: RequestHandler = async (req: Request, res: Response) => {
  try {
    const product = await Product.find().exec();
    return res.status(200).json(product);
  } catch (error) {
    res.status(400).json((error as Error).message);
  }
};

/**
 * @swagger
 * /products/{sku}:
 *  get:
 *    summary: return A product by sku
 *    tags: [Products]
 *    parameters:
 *      - name: sku
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *        example: '507e9797-d9c9-43a2-ac0c-34f349ee7ba9'
 *    responses:
 *      200:
 *        description:  array of Product Objects should be returned
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *            example:
 *              sku: '507e9797-d9c9-43a2-ac0c-34f349ee7ba9'
 *              productName: 'Computer Product Y
 *              category: 'Computers'
 *              price: 3
 *              quantity: 6
 *              description: product description
 *      '404':
 *        description: Not Found
 *        content:
 *          appplication/json:
 *            schema:
 *              type: object
 *            example: 'sku not found'
 */
const getProductBySku: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { sku } = req.params;
    const productBySku = await Product.findOne({
      sku: String(sku),
    });
    if (productBySku) {
      res.status(200).json({ message: productBySku });
    } else {
      res.status(404).json({ error: `${sku} not found!` });
    }
  } catch (error) {
    res.status(400).json((error as Error).message);
  }
};

/**
 * @swagger
 * /products:
 *  post:
 *    tags: [Products]
 *    summary: create a new product
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *          example:
 *              productName: 'Computer Product A'
 *              category: 'Computers'
 *              price: 36
 *              quantity: 9
 *              description: product description
 *    responses:
 *      '201':
 *        description: Created
 *        content:
 *          appplication/json:
 *            schema:
 *              type: object
 *            example:
 *              _id: 61da409632c8196efc5dd779
 *              sku: 'd7845b19-62a2-4616-96b7-73a2e31e0520'
 *              productName: 'Phone Product'
 *              category: 'Phones'
 *              price: 9
 *              quantity: 7
 *              description: product description
 *              __v: 0
 *      '400':
 *        description: Duplicate key
 *        content:
 *          appplication/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  exmaple: 'error message'
 */
const createProduct: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { productName, category, price, quantity, description } = req.body;
    const productByName = await Product.findOne({
      productName,
    });
    if (!productByName) {
      const product: IProduct = await Product.create({
        productName,
        category,
        price,
        quantity,
        description,
      });
      res.status(201).json(product);
    } else {
      res.status(404).json({ error: 'Duplicate product name!' });
    }
  } catch (error) {
    res.status(400).json((error as Error).message);
  }
};

/**
 * @swagger
 * /products/{sku}:
 *  put:
 *    tags: [Products]
 *    summary: update a existing product by email
 *    parameters:
 *      - name: sku
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *        example: '507e9797-d9c9-43a2-ac0c-34f349ee7ba9'
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *          example:
 *            productName: 'Computer Product S'
 *            category: 'Computers'
 *            price: 16
 *            quantity: 18
 *            description: product description
 *    responses:
 *      '200':
 *        description: OK
 *        content:
 *          appplication/json:
 *            schema:
 *                type: object
 *            example:
 *                sku: '507e9797-d9c9-43a2-ac0c-34f349ee7ba9'
 *                productName: 'Computer Product S'
 *                category: 'Computers'
 *                price: 3
 *                quantity: 6
 *                description: product description
 *      '400':
 *        description: Failed
 *        content:
 *          appplication/json:
 *            schema:
 *              type: object
 *            example: 'error message'
 *      '404':
 *        description: Not Found
 *        content:
 *          appplication/json:
 *            schema:
 *              type: object
 *            example: 'sku not found'
 */
const updateProductBySku: RequestHandler = async (req: Request, res: Response) => {
  const { sku } = req.params;
  const { productName, category, price, quantity, description } = req.body;
  if (!productName || !category || !price || !(quantity >= 0)) {
    return res.status(404).json({
      error: 'Input field must not be empty!',
    });
  }
  const product = await Product.findOneAndUpdate(
    { sku: String(sku) },
    {
      productName,
      category,
      price,
      quantity,
      description,
    },
    { new: true },
  ).exec();
  if (!product) {
    return res.status(404).json({
      error: 'Product not found!',
    });
  }
  return res.status(200).json(product);
};

/**
 * @swagger
 * /products/{sku}:
 *  delete:
 *    summary: return removed products by sku
 *    tags: [Products]
 *    parameters:
 *      - name: sku
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *        example: '507e9797-d9c9-43a2-ac0c-34f349ee7ba9'
 *    responses:
 *      200:
 *        description:  Deleted product should be returned
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *            example:
 *              _id: 61da409632c8196efc5dd789
 *              sku: 'd7845b19-62a2-4616-96b7-73a2e31e0520'
 *              productName: 'Phone Product'
 *              category: 'Phones'
 *              price: 9
 *              quantity: 7
 *              description: product description
 *              __v: 0
 *      404:
 *        description: product not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *            example:
 *              error: 'sku not found.'
 */
const deleteProductBySku: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { sku } = req.params;
    const CheckBySku = await Product.findOne({
      sku: String(sku),
    });
    if (CheckBySku) {
      await Product.deleteOne({
        sku: String(sku),
      });
      res.status(204).json({ message: 'Deleted' });
    } else {
      res.status(404).json({ error: `${sku} not found!` });
    }
  } catch (error) {
    res.status(400).json((error as Error).message);
  }
};

export { getAllProducts, getProductBySku, createProduct, updateProductBySku, deleteProductBySku };
