const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;
    if (!req.files)
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No hay archivo para cargar'
            }
        });

    // validart tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                menssage: 'Los tipos validos son ' + tiposValidos.join(', '),
                ext: tipo
            }
        });
    }
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];
    // Extensiones permitidas
    let extencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extencionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                menssage: 'Las extensiones validas son ' + extencionesValidas.join(', '),
                ext: extension
            }
        });
    }

    // Cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo, tipo);
        } else {
            imagenProducto(id, res, nombreArchivo, tipo);
        }
    });

    function imagenUsuario(id, res, nombreArchivo, tipo) {
        Usuario.findById(id, (err, usuarioBD) => {
            if (err) {
                borrarArchivo(nombreArchivo, tipo);
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!usuarioBD) {
                borrarArchivo(nombreArchivo, tipo);
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'usuario no existe'
                    }
                });
            }
            //revisar si existe la imagen
            //creamos una ruta a verificar
            borrarArchivo(usuarioBD.img, tipo);
            usuarioBD.img = nombreArchivo;
            usuarioBD.save((err, usuarioGuardado) => {
                res.json({
                    ok: true,
                    usuario: usuarioGuardado,
                    img: nombreArchivo
                });
            });
        });
    }


    function imagenProducto(id, res, nombreArchivo, tipo) {
        Producto.findById(id, (err, productoBD) => {
            if (err) {
                borrarArchivo(nombreArchivo, tipo);
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoBD) {
                borrarArchivo(nombreArchivo, tipo);
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'producto no existe'
                    }
                });
            }
            //revisar si existe la imagen
            //creamos una ruta a verificar
            borrarArchivo(productoBD.img, tipo);
            productoBD.img = nombreArchivo;
            productoBD.save((err, productoGuardado) => {
                res.json({
                    ok: true,
                    producto: productoGuardado,
                    img: nombreArchivo
                });
            });
        });

    }

    function borrarArchivo(nombreImagen, tipo) {
        let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
        if (fs.existsSync(pathImagen)) { //verificar si existe la imagen
            //elimina archivo
            fs.unlinkSync(pathImagen);
        }
    }
});


module.exports = app;