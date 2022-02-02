"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const UserSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['staff', 'admin'],
        default: 'staff',
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
});
UserSchema.pre('save', async function userId(next) {
    this.userId = await (0, uuid_1.v4)();
    next();
});
UserSchema.methods.toJSON = function delPassword() {
    const obj = this.toObject();
    delete obj.password;
    delete obj.__v;
    return obj;
};
const User = (0, mongoose_1.model)('User', UserSchema);
exports.default = User;
