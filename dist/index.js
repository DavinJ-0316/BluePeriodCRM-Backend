"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = __importDefault(require("@database/mongodb"));
const winston_1 = __importDefault(require("@config/winston"));
const app_1 = __importDefault(require("./app"));
(0, mongodb_1.default)();
const PORT = process.env.PORT || 3000;
app_1.default.listen(PORT, () => {
    winston_1.default.info(`App is listening on ${PORT}`);
});
