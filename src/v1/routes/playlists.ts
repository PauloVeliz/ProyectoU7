import { Router,Request,Response } from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

export const v1_playlists = Router();

const prisma = new PrismaClient();
dotenv.config();

v1_playlists.route('/playlist').post(async(req:Request,res:Response)=>{
    try {
        const body = req.body;
        let nombre_playlist = await prisma.playlist.findUnique({
            where: {name: body.name}
        });

        if (nombre_playlist){
            return res.status(400).json({message: 'Playlist already exist!'});
        }
        const playlist = await prisma.playlist.create({
            include: {
                songs:true
            },
            data: {
                name: body.name,
                user: { connect: { id: body.user_id } },
                songs: { create: body.songs}
            }
        });
        res.status(201).json(playlist);
    }  
    catch (error) {
        return res.status(500).json({OK: false, message: error});
    };
});

v1_playlists.route('/playlist/add-song').put(async(req:Request,res:Response)=>{
    try {
        const body = req.body;
        const playlist = await prisma.playlist.update({
            where:{
                id: body.id_playlist
            },
            include: {
                songs:true
            },
            data: {
                songs: { connect: { id: body.id_song } }
            }
        });
        res.status(201).json(playlist);
    }  
    catch (error) {
        return res.status(500).json({OK: false, message: error});
    };
});

v1_playlists.route('/playlist').get(async(req:Request,res:Response)=>{
    try {
        const playlists = await prisma.playlist.findMany();
                
        res.json(playlists);
    }
    catch (error) {
        return res.status(500).json({OK: false, message: error});
    }
});

v1_playlists.route('/playlist/:id').get(async(req:Request,res:Response)=>{
    try {
        const id_playlist = req.params.id;
        const playlist: any = await prisma.playlist.findUnique({
            where: {
                id: Number(id_playlist)
            },
            include: {
                songs:true
            }
        });
        res.json(playlist);
    }
    catch (error) {
        return res.status(500).json({OK: false, message: error});
    }
});