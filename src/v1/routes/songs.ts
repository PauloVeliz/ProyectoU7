import { Router,Request,Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

export const v1_songs = Router();

const prisma = new PrismaClient();
dotenv.config();

v1_songs.route('/songs').post(async(req:Request,res:Response)=>{
    try {
        const body = req.body;
        const song = await prisma.song.create({
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
        return res.status(500).json({OK: false, message: error});
    };
});

v1_songs.route('/songs').get(async(req:Request,res:Response)=>{
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '')||"";

        if (!token){
            return res.status(401).json({error:'No token!'})
        }
        const token_env = process.env.TOKEN_SECRET!;
        const user_loggedin:any = jwt.verify(token,token_env);

        const songs = await prisma.song.findMany();
                
        res.json({message: 'User Authenticated','All songs':songs});
      }
      catch (error) {
        const songs = await prisma.song.findMany({
            where:{
                access:false
            }
        });
        return res.json({message: 'User Not Authenticated', 'Public songs': songs});
      }
});

v1_songs.route('/songs/:id').get(async(req:Request,res:Response)=>{
    try{
        const token = req.header('Authorization')?.replace('Bearer ', '')||"";

        if (!token){
            return res.status(401).json({error:'No token!'})
        }
        const token_env = process.env.TOKEN_SECRET!;
        const user_loggedin:any = jwt.verify(token,token_env);

        const id_song = req.params.id;
        const song: any = await prisma.song.findUnique({
            where: {
                id: Number(id_song)
            }
        });
        res.json({message: 'User Authenticated','song':song});
    }
    catch (error) {
        const id_song = req.params.id;
        const song: any = await prisma.song.findUnique({
            where: {
                id: Number(id_song)
            }
        });
        if (song.access){
            return res.status(401).json({message: 'User Not Authenticated - It is Not a Public song'});
        }
        return res.json({message: 'User Not Authenticated','Public song':song});
    }    
});