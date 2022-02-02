"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signIn = exports.signUp = exports.updateUser = exports.deleteUser = exports.getOneUser = exports.getUsers = void 0;
const jwt_1 = require("@utils/jwt");
const users_model_1 = __importDefault(require("@models/users.model"));
const passwordHandler_1 = require("@utils/passwordHandler");
const validator_1 = require("@utils/validator");
// create user
const signUp = async (req, res) => {
    const { firstName, lastName, email, password, confirmedPassword } = req.body;
    if (!email || !firstName || !lastName || !password || !confirmedPassword) {
        return res.status(400).json({ error: 'Please enter all required data!' });
    }
    const passwordValidataResult = (0, validator_1.validatePassword)(password);
    if (!passwordValidataResult) {
        return res.status(400).json({
            error: 'Password should be 8-32 characters and include at least 1 letter, 1 number and 1 special character (@,#,$,%,^,_,&,*)!',
        });
    }
    if (password !== confirmedPassword) {
        return res.status(400).json({ error: "The passwords don't match." });
    }
    const emailValidateResult = (0, validator_1.validateEmail)(email);
    if (!emailValidateResult) {
        return res.status(400).json({
            error: 'It should be a valid email address!"',
        });
    }
    // check if user exist
    const existingUser = await users_model_1.default.findOne({ email });
    if (existingUser) {
        return res.status(403).json({
            error: 'This email has already been existed!',
        });
    }
    const hashedPassword = await (0, passwordHandler_1.hashPassword)(password);
    try {
        const newUser = await users_model_1.default.create({
            email,
            firstName,
            lastName,
            password: hashedPassword,
            role: req.body.role,
        });
        if (newUser.role === '') {
            return res.status(403).json({
                error: 'This user is failing to create!',
            });
        }
        const token = (0, jwt_1.generateToken)(newUser.userId, newUser.role);
        return res
            .set('Authorization', token)
            .status(201)
            .json({
            data: {
                user: newUser,
            },
        });
    }
    catch (error) {
        return res.status(403).json(error.message);
    }
};
exports.signUp = signUp;
const signIn = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ error: 'Please provide email and password!' });
    }
    const currentUser = await users_model_1.default.findOne({ email }).select('+password');
    if (!currentUser)
        return res.status(401).send({ error: 'User is not exist!' });
    const correctPassword = await (0, passwordHandler_1.comparePassword)(password, currentUser.password);
    if (!correctPassword) {
        return res.status(401).json({ error: 'Invalid password!' });
    }
    const token = (0, jwt_1.generateToken)(currentUser.userId, currentUser.role);
    const user = currentUser;
    return res.set('Authorization', token).status(200).json({ user });
};
exports.signIn = signIn;
const getUsers = async (req, res) => {
    const users = await users_model_1.default.find().exec();
    return res.status(200).json(users);
};
exports.getUsers = getUsers;
const getOneUser = async (req, res) => {
    const { id } = req.params;
    const user = await users_model_1.default.findById(id).exec();
    if (!user) {
        return res.status(404).json({ error: 'user not found' });
    }
    return res.json(user);
};
exports.getOneUser = getOneUser;
const deleteUser = (req, res) => {
    res.status(200).send('Failed');
};
exports.deleteUser = deleteUser;
const updateUser = (req, res) => {
    res.status(200).send('Failed');
};
exports.updateUser = updateUser;
