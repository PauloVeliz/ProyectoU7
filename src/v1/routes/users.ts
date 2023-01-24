import { Router,Request,Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

export const v1_users = Router();

const prisma = new PrismaClient();
const saltRounds = 10;
dotenv.config();

v1_users.route('/users').post( async(req:Request,res:Response)=>{
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

v1_users.route('/users/login').post( async(req:Request,res:Response)=>{
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

        res.json({'Token':token, 'last_session':user_updated.last_session});
    }  
    catch (error) {
        return res.status(500).json({OK: false, message: error});
    };
});

v1_users.route('/users').get( async(req:Request,res:Response)=>{
    try {
        const users = await prisma.user.findMany(); 
        res.json(users);
    }  
    catch (error) {
        return res.status(500).json({OK: false, message: error});
    };
});

v1_users.route('/users/:id').get( async(req:Request,res:Response)=>{
    try {
        const id_user = req.params.id;
        const user = await prisma.user.findUnique({
            where: {
                id: Number(id_user)
            },
        }); 
        res.json(user);
    }  
    catch (error) {
        return res.status(500).json({OK: false, message: error});
    };
});