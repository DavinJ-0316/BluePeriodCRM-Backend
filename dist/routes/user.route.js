"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authAccess_1 = require("@middleware/authAccess");
const users_controller_1 = require("@controllers/users.controller");
const router = express_1.default.Router();
router.get('/', authAccess_1.authValidator, users_controller_1.getUsers);
router.post('/signup', users_controller_1.signUp);
router.post('/login', users_controller_1.signIn);
router.put('/:id', users_controller_1.updateUser);
router.delete('/:id', authAccess_1.authValidator, (0, authAccess_1.isAdmin)('admin'), users_controller_1.deleteUser);
router.get('/:id', users_controller_1.getOneUser);
exports.default = router;
