"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = require("./v1/routes");
dotenv_1.default.config();
const port = process.env.PORT || 5000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
const baseRoute = '/api/v1';
app.use(baseRoute, routes_1.v1Router);
app.listen(port, () => {
    console.log(`Aplicación de Proyecto de U7 corriendo en puerto ${port}`);
});
