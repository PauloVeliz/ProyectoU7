import { Router,Request,Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { verify } from 'crypto';
import { exit } from 'process';
// import { access } from 'fs';

export const v1Router = Router();
const prisma = new PrismaClient();
const saltRounds = 10;
dotenv.config();

v1Router.route('/').get((req:Request,res:Response)=>{
    res.send('Proyecto de Unidad 7 - v1');
});

v1Router.route('/users').post( async(req:Request,res:Response)=>{
    try {
        const body = req.body;
        const hash_password = await bcrypt.hash(body.password,saltRounds);
        const user = await prisma.user.create({
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
        return res.status(500).json({OK: false, message: error});
    };
});

v1Router.route('/users/login').post( async(req:Request,res:Response)=>{
    try {
        const body = req.body;
        const user: any = await prisma.user.findUnique({
            where: {
                email: body.email
            }
        });

        if (!user) {
            return res.status(403).json({error:'This user doesnt exist!'});
        }

        const valida_password = await bcrypt.compare(body.password,user.password);
        if (!valida_password){
            return res.status(403).json({error:'Invalid Password!'});
        }

        const user_updated = await prisma.user.update({
            where: {
                email: user.email
            },
            data: {
                last_session: new Date()
            }
        });

        const token = jwt.sign({name:user.name},
			process.env.TOKEN_SECRET!,{expiresIn:'1800s'});

        res.status(201).json({'Token':token, 'last_session':user_updated.last_session});
    }  
    catch (error) {
        return res.status(500).json({OK: false, message: error});
    };
});

v1Router.route('/songs').post(async(req:Request,res:Response)=>{
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

v1Router.route('/songs').get(async(req:Request,res:Response)=>{
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '')||"";

        if (!token){
            return res.status(401).json({error:'No token!'})
        }
        const token_env = process.env.TOKEN_SECRET!;
        const user_loggedin:any = jwt.verify(token,token_env);

        const songs = await prisma.song.findMany();
                
        res.status(201).json({message: 'User Authenticated','All songs':songs});
      }
      catch (error) {
        const songs = await prisma.song.findMany({
            where:{
                access:false
            }
        });
        return res.status(201).json({message: 'User Not Authenticated', 'Public songs': songs});
      }
});

v1Router.route('/songs/:id').get(async(req:Request,res:Response)=>{
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
        res.status(201).json({message: 'User Authenticated','song':song});
    }
    catch (error) {
        const id_song = req.params.id;
        const song: any = await prisma.song.findUnique({
            where: {
                id: Number(id_song)
            }
        });
        if (song.access){
            return res.status(201).json({message: 'User Not Authenticated - It is Not a Public song'});
        }
        return res.status(201).json({message: 'User Not Authenticated','Public song':song});
    }    
});

