"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const winston_1 = __importDefault(require("@config/winston"));
const hashPassword = async (pw) => {
    try {
        const salt = await bcryptjs_1.default.genSalt(12);
        const hashedPassword = await bcryptjs_1.default.hash(pw, salt);
        return hashedPassword;
    }
    catch (error) {
        winston_1.default.error(error);
        throw new Error('password must be provided');
    }
};
exports.hashPassword = hashPassword;
const comparePassword = async (candidatePassword, hashedPassword) => {
    try {
        if (await bcryptjs_1.default.compare(candidatePassword, hashedPassword)) {
            return true;
        }
        return false;
    }
    catch (error) {
        winston_1.default.error(error);
        throw new Error('password and hash is required to compare');
    }
};
exports.comparePassword = comparePassword;
