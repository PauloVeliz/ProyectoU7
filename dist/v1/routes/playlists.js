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
exports.v1_playlists = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
exports.v1_playlists = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
dotenv_1.default.config();
exports.v1_playlists.route('/playlist').post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        let nombre_playlist = yield prisma.playlist.findUnique({
            where: { name: body.name }
        });
        if (nombre_playlist) {
            return res.status(400).json({ message: 'Playlist already exist!' });
        }
        const playlist = yield prisma.playlist.create({
            include: {
                songs: true
            },
            data: {
                name: body.name,
                user: { connect: { id: body.user_id } },
                songs: { create: body.songs }
            }
        });
        res.status(201).json(playlist);
    }
    catch (error) {
        return res.status(500).json({ OK: false, message: error });
    }
    ;
}));
exports.v1_playlists.route('/playlist/add-song').put((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const playlist = yield prisma.playlist.update({
            where: {
                id: body.id_playlist
            },
            include: {
                songs: true
            },
            data: {
                songs: { connect: { id: body.id_song } }
            }
        });
        res.status(201).json(playlist);
    }
    catch (error) {
        return res.status(500).json({ OK: false, message: error });
    }
    ;
}));
exports.v1_playlists.route('/playlist').get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const playlists = yield prisma.playlist.findMany();
        res.json(playlists);
    }
    catch (error) {
        return res.status(500).json({ OK: false, message: error });
    }
}));
exports.v1_playlists.route('/playlist/:id').get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id_playlist = req.params.id;
        const playlist = yield prisma.playlist.findUnique({
            where: {
                id: Number(id_playlist)
            },
            include: {
                songs: true
            }
        });
        res.json(playlist);
    }
    catch (error) {
        return res.status(500).json({ OK: false, message: error });
    }
}));
