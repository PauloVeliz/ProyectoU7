"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const users_1 = require("./v1/routes/users");
const songs_1 = require("./v1/routes/songs");
const playlists_1 = require("./v1/routes/playlists");
dotenv_1.default.config();
const port = process.env.PORT || 4000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
const baseRoute = '/api/v1';
app.use(baseRoute, users_1.v1_users);
app.use(baseRoute, songs_1.v1_songs);
app.use(baseRoute, playlists_1.v1_playlists);
app.listen(port, () => {
    console.log(`Aplicación de Proyecto de U7 corriendo en puerto ${port}`);
});
