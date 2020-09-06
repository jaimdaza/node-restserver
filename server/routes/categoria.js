const express = require('express');
const { verificaToken, verificaAdmin_role } = require('../middlewares/authentication');
const Categoria = require('../models/categoria');
const app = express();

// mostrar todas las categorias
app.get('/categorias', verificaToken, (req, res) => {
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;
    Categoria.find({}) // {} van filtros ejmplo google : true, '' los campos que quiero mostar
        .sort('descripcion')
        .skip(desde) // saltar de n en n
        .limit(limite) // solo n registro
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Categoria.countDocuments({}, (err, conteo) => { // {} van filtros ejmplo google : true
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                return res.json({
                    ok: true,
                    categorias,
                    count: conteo
                });
            });

        });
});


// mostrar una categoria por id
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }
        return res.json({
            ok: true,
            categoria: categoriaDB
        });;
    });
});

// agregar nueva categoria
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body; // se obtiene el objeto que viene en peticion
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//actualizar categoria
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id; // se obtiene el parametro que viene por URL, id
    let body = req.body; // es para indicar que voy actualizar
    Categoria.findOneAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//eliminar categoria
app.delete('/categoria/:id', [verificaToken, verificaAdmin_role], (req, res) => {
    let id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, categoriaBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'categoria no encontrada'
                }
            });
        }
        return res.json({
            ok: true,
            categoria: categoriaBorrado
        });
    });
});

module.exports = app;