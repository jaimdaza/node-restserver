const express = require('express');
const bcrypt = require('bcrypt'); // codificar la contraseña
const _ = require('underscore');
const Usuario = require('../models/usuario');
const app = express();

app.get('/usuario', function(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = Number(req.query.limite) || 5;
    Usuario.find({ estado: true }, 'nombre email role estado google img') // {} van filtros ejmplo google : true, '' los campos que quiero mostar
        .skip(desde) // saltar de n en n
        .limit(limite) // solo n registro
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.count({ estado: true }, (err, conteo) => { // {} van filtros ejmplo google : true
                return res.json({
                    ok: true,
                    usuarios,
                    count: conteo
                });
            });

        });
});

app.post('/usuario', function(req, res) {
    let body = req.body; // se obtiene el objeto que viene en peticion
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    //guadar en base de datos
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        //usuarioDB.password = null;
        return res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id; // se obtiene el parametro que viene por URL, id
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']); // es para indicar que voy actualizar
    Usuario.findOneAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            usuario: usuarioDB
        });
    });



});

/* app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        return res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });

}); */

app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let estado = {
        estado: false
    };
    Usuario.findOneAndUpdate(id, estado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        return res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });

});


module.exports = app;