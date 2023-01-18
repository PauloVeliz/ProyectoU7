const express = require('express');
const app = express();
const port = 4000;

app.get('/',(req,res)=>{
    res.send('Proyecto de Unidad 7');
});

app.listen(port,()=>{
    console.log(`Aplicación de Proyecto de U7 corriendo en puerto ${port}`)
});