"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.v1Router = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
exports.v1Router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const saltRounds = 10;
dotenv_1.default.config();
exports.v1Router.route('/').get((req, res) => {
    res.send('Proyecto de Unidad 7 - v1');
});
exports.v1Router.route('/users').post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const hash_password = yield bcrypt_1.default.hash(body.password, saltRounds);
        const user = yield prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                password: hash_password,
                date_born: new Date(body.date_born)
            },
        });
        res.status(201).json(user);
    }
    catch (error) {
        return res.status(500).json({ OK: false, message: error });
    }
    ;
}));
exports.v1Router.route('/users/login').post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const user = yield prisma.user.findUnique({
            where: {
                email: body.email
            }
        });
        if (!user) {
            return res.status(403).json({ error: 'This user doesnt exist!' });
        }
        const valida_password = yield bcrypt_1.default.compare(body.password, user.password);
        if (!valida_password) {
            return res.status(403).json({ error: 'Invalid Password!' });
        }
        const user_updated = yield prisma.user.update({
            where: {
                email: user.email
            },
            data: {
                last_session: new Date()
            }
        });
        const token = jsonwebtoken_1.default.sign({ name: user.name }, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
        res.status(201).json({ 'Token': token, 'last_session': user_updated.last_session });
    }
    catch (error) {
        return res.status(500).json({ OK: false, message: error });
    }
    ;
}));
exports.v1Router.route('/songs').post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const song = yield prisma.song.create({
            data: {
                name: body.name,
                artist: body.artist,
                album: body.album,
                year: body.year,
                genre: body.genre,
                duration: body.duration,
                access: body.access
            },
        });
        res.status(201).json(song);
    }
    catch (error) {
        return res.status(500).json({ OK: false, message: error });
    }
    ;
}));
exports.v1Router.route('/songs').get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = ((_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '')) || "";
        if (!token) {
            return res.status(401).json({ error: 'No token!' });
        }
        const token_env = process.env.TOKEN_SECRET;
        const user_loggedin = jsonwebtoken_1.default.verify(token, token_env);
        const songs = yield prisma.song.findMany();
        res.status(201).json({ message: 'User Authenticated', 'All songs': songs });
    }
    catch (error) {
        const songs = yield prisma.song.findMany({
            where: {
                access: false
            }
        });
        return res.status(201).json({ message: 'User Not Authenticated', 'Public songs': songs });
    }
}));
exports.v1Router.route('/songs/:id').get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const token = ((_b = req.header('Authorization')) === null || _b === void 0 ? void 0 : _b.replace('Bearer ', '')) || "";
        if (!token) {
            return res.status(401).json({ error: 'No token!' });
        }
        const token_env = process.env.TOKEN_SECRET;
        const user_loggedin = jsonwebtoken_1.default.verify(token, token_env);
        const id_song = req.params.id;
        const song = yield prisma.song.findUnique({
            where: {
                id: Number(id_song)
            }
        });
        res.status(201).json({ message: 'User Authenticated', 'song': song });
    }
    catch (error) {
        const id_song = req.params.id;
        const song = yield prisma.song.findUnique({
            where: {
                id: Number(id_song)
            }
        });
        if (song.access) {
            return res.status(201).json({ message: 'User Not Authenticated - It is Not a Public song' });
        }
        return res.status(201).json({ message: 'User Not Authenticated', 'Public song': song });
    }
}));
