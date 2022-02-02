"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authAccess_1 = require("@middleware/authAccess");
const customers_controller_1 = require("@controllers/customers.controller");
const router = express_1.default.Router();
router.get('/', authAccess_1.authValidator, (0, authAccess_1.isAdmin)('admin'), customers_controller_1.getAllCustomers);
router.post('/', customers_controller_1.createNewCustomer);
router.put('/:id', customers_controller_1.updateCustomerById);
router.delete('/:id', customers_controller_1.deleteCustomerById);
router.get('/:id', customers_controller_1.getCustomerById);
console.log("testing");
exports.default = router;
