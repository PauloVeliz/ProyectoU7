import { Router,Request,Response } from 'express';

export const v1Router = Router();

v1Router.route('/').get((req:Request,res:Response)=>{
    res.send('Proyecto de Unidad 7 - v1');
});