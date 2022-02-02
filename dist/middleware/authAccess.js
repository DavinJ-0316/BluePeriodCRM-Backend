"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.authValidator = void 0;
const users_model_1 = __importDefault(require("@models/users.model"));
const jwt_1 = require("@utils/jwt");
const authValidator = async (req, res, next) => {
    const authorizationHeader = req.header('Authorization');
    const tokenArray = authorizationHeader.split(' ');
    const token = tokenArray[1];
    if (!authorizationHeader) {
        return res.status(401).json({ error: 'You are not logged in! Please login to get access' });
    }
    if (tokenArray[0] !== 'Bearer' || tokenArray.length !== 2) {
        return res.status(401).json({ error: 'Please provide token' });
    }
    const decode = (0, jwt_1.validateToken)(token);
    try {
        const currentUser = await users_model_1.default.findOne({ userId: decode.id });
        if (!currentUser) {
            return res.status(401).json({ error: 'The user belonging to this token does no longer exist' });
        }
        req.user = currentUser;
    }
    catch (error) {
        return res.status(400).json(error.message);
    }
    return next();
};
exports.authValidator = authValidator;
const isAdmin = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'You do not have permission to perform this action' });
    }
    return next();
};
exports.isAdmin = isAdmin;
