import express, {Express} from 'express';
import dotenv from 'dotenv';
import { v1Router } from './v1/routes';

// const v1Router = require('./src/v1/routes'); //

dotenv.config();
const port = process.env.PORT || 4000;
const app:Express = express();
app.use(express.json());

const baseRoute = '/api/v1';
app.use(baseRoute,v1Router);    //

app.listen(port,()=>{
    console.log(`Aplicación de Proyecto de U7 corriendo en puerto ${port}`)
});