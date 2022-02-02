"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = exports.updateProduct = exports.deleteProduct = exports.getOneProduct = exports.getProducts = void 0;
const getProducts = (req, res) => {
    res.status(200).send('Get the Products');
};
exports.getProducts = getProducts;
const getOneProduct = (req, res) => {
    res.status(200).send('Failed');
};
exports.getOneProduct = getOneProduct;
const deleteProduct = (req, res) => {
    res.status(200).send('Failed');
};
exports.deleteProduct = deleteProduct;
const updateProduct = (req, res) => {
    res.status(200).send('Failed');
};
exports.updateProduct = updateProduct;
const createProduct = (req, res) => {
    res.status(200).send('Failed');
};
exports.createProduct = createProduct;
