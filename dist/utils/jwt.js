"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (id, role) => {
    const secret = process.env.JWT_SECRET;
    const token = jsonwebtoken_1.default.sign({ id, role }, secret, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });
    return token;
};
exports.generateToken = generateToken;
const validateToken = (token) => {
    const secret = process.env.JWT_SECRET;
    try {
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch (error) {
        return error;
    }
};
exports.validateToken = validateToken;
