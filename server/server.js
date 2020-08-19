require('./config/config.js')
const express = require('express');
// Using Node.js `require()`
const mongoose = require('mongoose');


const app = express();
const bodyParser = require('body-parser'); // se usa para obtener objetos que vengan en la peticion

// parse application/x-www-form-urlencoded son funciones
app.use(bodyParser.urlencoded({ extended: false })); // se usa para obtener objetos que vengan en la peticion
// parse application/json son funciones
app.use(bodyParser.json()); // se usa para obtener objetos que vengan en la peticion
// llama las rutas creadas
/*app.use(require('./routes/usuario'));
app.use(require('./routes/login'));*/
// se comenta anterio y se deja una sola configuracion global
app.use(require('./routes/index'));


mongoose.set('useFindAndModify', false);
//mongoose.connect('mongodb://localhost:27017/cafe', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => { console.log('Connected to Mongo!!'); })
    .catch((error) => { console.log('Error connecting to Mongo', error); });


app.listen(process.env.PORT, () => console.log('Escuchando el puerto: ', 3000));