"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewCustomer = exports.updateCustomerById = exports.deleteCustomerById = exports.getCustomerById = exports.getAllCustomers = void 0;
const customers_model_1 = __importDefault(require("@models/customers.model"));
const getAllCustomers = async (req, res) => {
    try {
        const customers = await customers_model_1.default.find().exec();
        res.status(200).json(customers);
    }
    catch (e) {
        res.status(400).json({ error: e.message });
    }
};
exports.getAllCustomers = getAllCustomers;
const getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        const customerById = await customers_model_1.default.findOne({
            customerId: String(id)
        });
        if (customerById) {
            res.status(200).json({ message: customerById });
        }
        else {
            res.status(404).json({ error: `${id} not found` });
        }
    }
    catch (e) {
        res.status(400).json({ error: e.message });
    }
};
exports.getCustomerById = getCustomerById;
const deleteCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        const CheckById = await customers_model_1.default.findOne({
            customerId: String(id)
        });
        if (CheckById) {
            await customers_model_1.default.deleteOne({
                customerId: String(id)
            });
            res.status(204).json({ message: 'deleted' });
        }
        else {
            res.status(404).json({ error: `${id} not found` });
        }
    }
    catch (e) {
        res.status(400).json({ error: e.message });
    }
};
exports.deleteCustomerById = deleteCustomerById;
const updateCustomerById = async (req, res) => {
    const { id } = req.params;
    const { email, firstName, lastName, phone, dob, notification, gender, address } = req.body;
    if (gender === "male" || gender === "female" || gender === "undisclosed"
        || gender === null || gender === undefined || gender === "") {
        const customer = await customers_model_1.default.findOneAndUpdate({ customerId: id }, {
            email,
            firstName,
            lastName,
            phone,
            dob,
            notification,
            gender,
            address
        }, { new: true }).exec();
        if (!customer) {
            return res.status(404).json({ error: 'customer not found.' });
        }
        return res.status(200).json(customer);
    }
    else {
        return res.status(404).json({ error: 'please enter male or female or undisclosed in gender or you can skip the gender option' });
    }
};
exports.updateCustomerById = updateCustomerById;
const createNewCustomer = async (req, res) => {
    const { email, firstName, lastName, phone, dob, notification, gender, address } = req.body;
    if (gender === "male" || gender === "female" || gender === "undisclosed"
        || gender === null || gender === undefined || gender === "") {
        try {
            const customer = await customers_model_1.default.create({
                email,
                firstName,
                lastName,
                phone,
                dob,
                notification,
                gender,
                address
            });
            res.status(201).json(customer);
        }
        catch (e) {
            res.status(400).json({ error: e.message });
        }
    }
    else {
        return res.status(404).json({ error: 'please enter male or female or undisclosed in gender or you can skip the gender option' });
    }
};
exports.createNewCustomer = createNewCustomer;
