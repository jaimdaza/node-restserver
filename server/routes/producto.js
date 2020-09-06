const express = require('express');

const { verificaToken } = require('../middlewares/authentication');
let app = express();

let Producto = require('../models/producto');

//////////////////////
// Obtener todos los productos
/////////////////////
app.get('/productos', verificaToken, (req, res) => {
    // todos los productos
    // usuarios y categorias
    // paginado
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;
    Producto.find({ disponible: true })
        .skip(desde) // saltar de n en n
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            Producto.countDocuments({}, (err, conteo) => { // {} van filtros ejmplo google : true
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                return res.json({
                    ok: true,
                    productos,
                    count: conteo
                });
            });

        });

});

//////////////////////
// Obtener un productos
/////////////////////
app.get('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
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

//////////////////////
// Buscar productos
/////////////////////

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i'); // i para que ignore mayuscula miniscula
    Producto.find({ nombre: regex }) // para buscar coincidencias flexibles
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productoDB
            });
        });

});

//////////////////////
// Crear un productos
/////////////////////
app.post('/productos', verificaToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            producto: productoDB
        });
    });
});


//////////////////////
// actualizar un productos
/////////////////////
app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    Producto.findOneAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }
        return res.json({
            ok: true,
            categoria: productoDB
        });
    });
});

//////////////////////
// actualizar un productos
/////////////////////
app.delete('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findOneAndUpdate(id, { disponible: false }, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }
        return res.json({
            ok: true,
            message: 'Producto eliminado'
        });
    });
});





module.exports = app;