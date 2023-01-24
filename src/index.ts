import express, {Express} from 'express';
import dotenv from 'dotenv';
import { v1_users } from './v1/routes/users';
import { v1_songs } from './v1/routes/songs';
import { v1_playlists } from './v1/routes/playlists';

dotenv.config();
const port = process.env.PORT || 4000;
const app:Express = express();
app.use(express.json());

const baseRoute = '/api/v1';

app.use(baseRoute,v1_users);
app.use(baseRoute,v1_songs);
app.use(baseRoute,v1_playlists);

app.listen(port,()=>{
    console.log(`Aplicación de Proyecto de U7 corriendo en puerto ${port}`)
});