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
exports.v1_songs = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
exports.v1_songs = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
dotenv_1.default.config();
exports.v1_songs.route('/songs').post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.v1_songs.route('/songs').get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = ((_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '')) || "";
        if (!token) {
            return res.status(401).json({ error: 'No token!' });
        }
        const token_env = process.env.TOKEN_SECRET;
        const user_loggedin = jsonwebtoken_1.default.verify(token, token_env);
        const songs = yield prisma.song.findMany();
        res.json({ message: 'User Authenticated', 'All songs': songs });
    }
    catch (error) {
        const songs = yield prisma.song.findMany({
            where: {
                access: false
            }
        });
        return res.json({ message: 'User Not Authenticated', 'Public songs': songs });
    }
}));
exports.v1_songs.route('/songs/:id').get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        res.json({ message: 'User Authenticated', 'song': song });
    }
    catch (error) {
        const id_song = req.params.id;
        const song = yield prisma.song.findUnique({
            where: {
                id: Number(id_song)
            }
        });
        if (song.access) {
            return res.status(401).json({ message: 'User Not Authenticated - It is Not a Public song' });
        }
        return res.json({ message: 'User Not Authenticated', 'Public song': song });
    }
}));
