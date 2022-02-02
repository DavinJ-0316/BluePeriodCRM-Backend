import { Request, Response, RequestHandler } from 'express';
import Customer from '@models/customers.model';
import { ICustomer } from '../types/customer';

/**
 * @swagger
 * /customers:
 *  post:
 *    tags: [Customers]
 *    summary: create a new Customer
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *          example:
 *              email: ante@aol.net
 *              firstName: Madeson
 *              lastName: Jakeem
 *              phone: (07) 4726 4819
 *              address:
 *                street: '245 George St'
 *                city: 'Syndey'
 *                state: 'NSW'
 *                postcode: '2000'
 *              gender: Female
 *              dob: '1996-07-13'
 *    responses:
 *      '201':
 *        description: Created
 *        content:
 *          appplication/json:
 *            schema:
 *              type: object
 *            example:
 *              _id: 61da409632c8196efc5dd789
 *              email: ante@aol.net
 *              firstName: Caleb Collins
 *              lastName: Baxter Burt
 *              dob: '1996-02-28T00:00:00.000Z'
 *              phone: (06) 5828 5812
 *              notification:
 *                - email
 *              address:
 *                street: '245 George St'
 *                city: 'Syndey'
 *                state: 'NSW'
 *                postcode: '2000'
 *              gender: Male
 *              totalSpent: 0
 *              orderAccumulation: 0
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
const createNewCustomer: RequestHandler = async (req: Request, res: Response) => {
  const { email, firstName, lastName, phone, address, gender } = req.body;
  if (!email || !firstName || !lastName || !phone || !address || !gender) {
    return res.status(400).json({ error: 'Please enter all required data!' });
  }
  try {
    // check if Customer exist
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(403).json({
        error: 'This email has already been existed!',
      });
    }
    const customer: ICustomer = await Customer.create({
      email,
      firstName,
      lastName,
      phone,
      address,
      gender,
    });

    return res.status(201).json(customer);
  } catch (e) {
    return res.status(400).json((e as Error).message);
  }
};

/**
 * @swagger
 * /customers:
 *  get:
 *    summary: return all Customers, remove  notification, __version
 *    tags: [Customers]
 *    responses:
 *      200:
 *        description:  array of Customer Objects should be returned
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *            example:
 *              - address:
 *                  street: 245 George St
 *                  city: Syndey
 *                  state: 'NSW'
 *                  postcode: 2000
 *                email: ante@aol.net
 *                firstName: Madeson Lara
 *                lastName: Jakeem Fuller
 *                dob: '1996-07-13T00:00:00.000Z'
 *                phone: (07) 4726 4819
 *                gender: Female
 *                totalSpent: 0
 *                orderAccumulation: 0
 *              - address:
 *                  street: 245 George St
 *                  city: Syndey
 *                  state: 'NSW'
 *                  postcode: 2000
 *                email: ante@aol.net
 *                firstName: Madeson Lara
 *                lastName: Jakeem Fuller
 *                dob: '1996-07-13T00:00:00.000Z'
 *                phone: (07) 4726 4819
 *                gender: Female
 *                totalSpent: 0
 *                orderAccumulation: 0
 *              - address:
 *                  street: 245 George St
 *                  city: Syndey
 *                  state: 'NSW'
 *                  postcode: 2000
 *                email: ante@aol.net
 *                firstName: Madeson Lara
 *                lastName: Jakeem Fuller
 *                dob: '1996-07-13T00:00:00.000Z'
 *                phone: (07) 4726 4819
 *                gender: Female
 *                totalSpent: 0
 *                orderAccumulation: 0
 */
const getAllCustomers: RequestHandler = async (req: Request, res: Response) => {
  try {
    const customers = await Customer.find({}, { notification: 0, __v: 0 }).exec();
    res.status(200).json(customers);
  } catch (e) {
    res.status(400).json((e as Error).message);
  }
};

/**
 * @swagger
 * /customers/{email}:
 *  get:
 *    summary: return Customers by email
 *    tags: [Customers]
 *    parameters:
 *      - name: email
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *        example: 'ante@aol.net'
 *    responses:
 *      200:
 *        description:  array of Customer Objects should be returned
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *            example:
 *              address:
 *                street: 245 George St
 *                city: Syndey
 *                state: 'NSW'
 *                postcode: 2000
 *              email: ante@aol.net
 *              firstName: Madeson Lara
 *              lastName: Jakeem Fuller
 *              dob: '1996-07-13T00:00:00.000Z'
 *              phone: (07) 4726 4819
 *              notification:
 *                - email
 *              gender: Female
 *      '404':
 *        description: Not Found
 *        content:
 *          appplication/json:
 *            schema:
 *              type: object
 *            example: 'ante@aol.net not found'
 */
const getCustomerByEmail: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const customerByEmail = await Customer.findOne({ email: `${email}` }, { _id: 0, __v: 0 });
    if (customerByEmail) {
      res.status(200).json(customerByEmail);
    } else {
      res.status(404).json({ error: `${email} not found` });
    }
  } catch (e) {
    res.status(400).json((e as Error).message);
  }
};

/**
 * @swagger
 * /customers/{email}:
 *  delete:
 *    summary: return removed Customers by email
 *    tags: [Customers]
 *    parameters:
 *      - name: email
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *        example: 'ante@aol.net'
 *    responses:
 *      200:
 *        description:  Deleted Customer should be returned
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *            example:
 *              _id: 61da409632c8196efc5dd789
 *              email: ante@aol.net
 *              firstName: Caleb Collins
 *              lastName: Baxter Burt
 *              dob: '1996-02-28T00:00:00.000Z'
 *              phone: (06) 5828 5812
 *              notification:
 *                - email
 *              address:
 *                street: '245 George St'
 *                city: 'Syndey'
 *                state: 'NSW'
 *                postcode: '2000'
 *              gender: Male
 *              totalSpent: 0
 *              orderAccumulation: 0
 *              __v: 0
 *      404:
 *        description: Customer not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *            example:
 *              error: 'mauris@aol.orga not found.'
 */
const deleteCustomerByEmail: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const CheckByEmail = await Customer.findOne({
      email: String(email),
    });
    if (CheckByEmail) {
      await Customer.deleteOne({
        email: String(email),
      });
      res.status(200).json(CheckByEmail);
    } else {
      res.status(404).json({ error: `${email} not found` });
    }
  } catch (e) {
    res.status(400).json((e as Error).message);
  }
};

/**
 * @swagger
 * /customers/{email}:
 *  put:
 *    tags: [Customers]
 *    summary: update a existing Customer by email
 *    parameters:
 *      - name: email
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *        example: 'ante@aol.net'
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *          example:
 *            email: ante@aol.net
 *            firstName: Caleb Collins
 *            lastName: Baxter Burt
 *            phone: (06) 5828 5812
 *            address:
 *              street: '245 George St'
 *              city: 'Syndey'
 *              state: 'NSW'
 *              postcode: '2000'
 *            notification:
 *              - phone
 *              - email
 *            gender: Male
 *            dob: '1996-02-28'
 *    responses:
 *      '200':
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *                type: object
 *            example:
 *                email: ante@aol.net
 *                firstName: Caleb Collins
 *                lastName: Baxter Burt
 *                phone: (06) 5828 5812
 *                address:
 *                  street: '245 George St'
 *                  city: 'Syndey'
 *                  state: 'NSW'
 *                  postcode: '2000'
 *                notification:
 *                  - phone
 *                  - email
 *                gender: Male
 *                dob: '1996-02-28'
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
 *            example: 'ante@aol.net not found'
 */
const updateCustomerByEmail: RequestHandler = async (req: Request, res: Response) => {
  const { email } = req.params;
  const { firstName, lastName, phone, address, gender } = req.body;

  if (!firstName || !lastName || !phone || !address || !gender) {
    return res.status(400).json({ error: 'input fields cannot be empty.' });
  }

  try {
    const customerByEmail = await Customer.findOne({ email: `${email}` }, { _id: 0 });
    if (!customerByEmail) {
      res.status(404).json({ error: `${email} not found` });
    } else {
      const newCustomer = await Customer.findOneAndUpdate(
        { email: `${email}` },
        {
          firstName,
          lastName,
          phone,
          address,
          gender,
        },
        { new: true },
      ).exec();
      return res.status(200).json(newCustomer);
    }
  } catch (e) {
    return res.status(400).json((e as Error).message);
  }
};

export { getAllCustomers, getCustomerByEmail, deleteCustomerByEmail, updateCustomerByEmail, createNewCustomer };
