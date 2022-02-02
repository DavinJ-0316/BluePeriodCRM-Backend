"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orders_controller_1 = require("@controllers/orders.controller");
const router = (0, express_1.Router)();
router.get('/', orders_controller_1.getAllOrders);
router.post('/', orders_controller_1.createOrder);
router.put('/:id', orders_controller_1.updateOrderById);
router.delete('/:id', orders_controller_1.deleteOrderById);
router.get('/:id', orders_controller_1.getOrderById);
exports.default = router;
