const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const app = express();


app.post('/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario y/o contrañesa incorrectos'
                }
            });
        }
        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario y/o contrañesa incorrectos'
                }
            });
        }
        let token = jwt.sign({ Usuario: usuarioBD }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); // 60 segundos, 60 min, 24 horas 30 dias
        res.json({
            ok: true,
            Usuario: usuarioBD,
            token
        });
    });
});





module.exports = app;