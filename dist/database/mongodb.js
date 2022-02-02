"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const winston_1 = __importDefault(require("@config/winston"));
exports.default = async () => {
    if (!process.env.CONNECTION_STRING) {
        winston_1.default.error('connection string not defined');
        process.exit(1);
    }
    const connectionString = process.env.CONNECTION_STRING;
    const connect = async () => {
        try {
            await mongoose_1.default.connect(connectionString);
            winston_1.default.info(`Successfully connected to database: ${process.env.DB_NAME}, ${process.env.CONNECTION_STRING}`);
            return;
        }
        catch (error) {
            winston_1.default.error('Error connecting to database: ', error);
            process.exit(1);
        }
    };
    connect();
    mongoose_1.default.connection.on('disconnected', () => {
        winston_1.default.info('mongodb connection lost');
    });
};
