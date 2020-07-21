require('./config/config.js')
const express = require('express')
const app = express();
const bodyParser = require('body-parser'); // se usa para obtener objetos que vengan en la peticion

// parse application/x-www-form-urlencoded son funciones
app.use(bodyParser.urlencoded({ extended: false })) // se usa para obtener objetos que vengan en la peticion
    // parse application/json son funciones
app.use(bodyParser.json()) // se usa para obtener objetos que vengan en la peticion

app.get('/usuario', function(req, res) {
    res.json('get usuario');
});

app.post('/usuario', function(req, res) {
    let body = req.body; // se obtiene el objeto que viene en peticion
    res.json({ persona: body });
});

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id; // se obtiene el parametro que viene por URL, id
    res.json('put usuario' + id);
});

app.delete('/usuario', function(req, res) {
    res.json('delete usuario');
});
app.listen(process.env.PORT, () => console.log('Escuchando el puerto: ', 3000));