"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = exports.updateOrderById = exports.deleteOrderById = exports.getOrderById = exports.getAllOrders = void 0;
const orders_model_1 = __importDefault(require("@models/orders.model"));
const Joi = require('joi');
const createOrder = async (req, res) => {
    const { customerId, products } = req.body;
    if (!customerId || !products) {
        return res.status(400).json({ error: 'input fields cannot be empty.' });
    }
    try {
        const dateCreated = new Date();
        const order = await orders_model_1.default.create({
            customerId,
            products,
            dateCreated,
            status: 'PENDING',
        });
        return res.status(201).json(order);
    }
    catch (error) {
        return res.status(403).json(error.message);
    }
};
exports.createOrder = createOrder;
const getAllOrders = async (req, res) => {
    const orders = await orders_model_1.default.find().exec();
    return res.status(200).json(orders);
};
exports.getAllOrders = getAllOrders;
const getOrderById = async (req, res) => {
    const { id } = req.params;
    const order = await orders_model_1.default.findOne({ orderId: id });
    if (!order) {
        return res.status(404).json({ error: 'order not found' });
    }
    return res.status(200).json(order);
};
exports.getOrderById = getOrderById;
const deleteOrderById = async (req, res) => {
    const { id } = req.params;
    const order = await orders_model_1.default.findOneAndDelete({ orderId: id });
    if (!order) {
        return res.status(404).json({ error: 'order not found' });
    }
    return res.status(200).json(order);
};
exports.deleteOrderById = deleteOrderById;
const updateOrderById = async (req, res) => {
    const { id } = req.params;
    const { customerId, products, status } = req.body;
    if (!customerId || !products || !status) {
        return res.status(400).json({ error: 'input fields cannot be empty.' });
    }
    const order = await orders_model_1.default.findOneAndUpdate({ orderId: id }, { customerId, products, status }, { new: true }).exec();
    if (!order) {
        return res.status(404).json({ error: 'order not found.' });
    }
    return res.status(200).json(order);
};
exports.updateOrderById = updateOrderById;
