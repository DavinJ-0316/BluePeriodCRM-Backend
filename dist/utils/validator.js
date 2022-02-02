"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = exports.validatePassword = void 0;
const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^_&*])[a-zA-Z0-9!@#$%^_&*]{8,32}$/;
    const passwordValidataResult = passwordRegex.test(password);
    return passwordValidataResult;
};
exports.validatePassword = validatePassword;
const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const emailValidateResult = emailRegex.test(email);
    return emailValidateResult;
};
exports.validateEmail = validateEmail;
