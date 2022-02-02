"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    orderId: {
        type: String,
        unique: true,
    },
    customerId: {
        type: String,
        required: true,
    },
    products: {
        type: [String],
        required: true,
    },
    dateCreated: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'CANCELED'],
        required: true,
    },
});
orderSchema.pre('save', async function orderId(next) {
    const now = await new Date().getTime();
    this.orderId = await `OR-${now}`;
    next();
});
const Order = (0, mongoose_1.model)('Order', orderSchema);
exports.default = Order;
