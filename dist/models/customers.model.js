"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const customerSchema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        index: true,
        unique: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
        required: true,
    },
    notification: {
        type: [String],
        enum: ['SMS', 'phone', 'email']
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'undisclosed']
    },
    address: {
        street: { type: String },
        city: { type: String },
        postCode: { type: String }
    }
});
const Customer = mongoose_1.default.model('Customer', customerSchema);
exports.default = Customer;
