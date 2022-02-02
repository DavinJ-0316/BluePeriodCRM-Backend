"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_route_1 = __importDefault(require("./product.route"));
const customer_route_1 = __importDefault(require("./customer.route"));
const user_route_1 = __importDefault(require("./user.route"));
const order_route_1 = __importDefault(require("./order.route"));
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.send('APIs working');
});
router.use('/users', user_route_1.default);
router.use('/products', product_route_1.default);
router.use('/customers', customer_route_1.default);
router.use('/orders', order_route_1.default);
exports.default = router;
