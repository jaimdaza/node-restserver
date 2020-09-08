const express = require('express');
const fs = require('fs');
const path = require('path')

const { verificaTokenUrl } = require('../middlewares/authentication');

const app = express();


app.get('/imagen/:tipo/:img', verificaTokenUrl, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    if (fs.existsSync(pathImagen)) { //verificar si existe la imagen
        res.sendFile(pathImagen); // devuelve contenido
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath);
    }




});

module.exports = app;