import { Router,Request,Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
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
        res.status(500).json({OK: false, message: error});
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
            res.status(403).json({error:'This user doesnt exist!'});
        }
        console.log('aquí');
        const valida_password = await bcrypt.compare(body.password,user.password);
        console.log('boom');
        if (!valida_password){
            console.log(valida_password);
            res.status(403).json({error:'Invalid Password!'});
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
        res.status(500).json({OK: false, message: error});
    };
});

v1Router.route('/songs').post( async(req:Request,res:Response)=>{
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
        res.status(500).json({OK: false, message: error});
    };
});