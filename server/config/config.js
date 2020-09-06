/**
 * Configuracion global
 * 
 */

// Config Puerto
process.env.PORT = process.env.PORT || 3000;

//======================
// entorno
//======================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//======================
// vencimiento token,  60 segundos, 60 min, 24 horas, 30 dias
//======================
process.env.CADUCIDAD_TOKEN = '72h' // 60 * 60 * 24 * 30;
    //======================
    // SEEd de autenticacion
    //======================
process.env.SEED = process.env.SEED || 'secret-seed-desarrollo';


//======================
// Bade de datos
//======================
let urlBD;
if (process.env.NODE_ENV === 'dev') {
    urlBD = 'mongodb://localhost:27017/cafe';
} else {
    urlBD = process.env.MONGO_URI;
}

process.env.URLDB = urlBD;

//======================
// Google client ID
//======================

process.env.CLIENT_ID = process.env.CLIENT_ID || '501541637546-g8fn2hbgi6afpobv6u6cmib3n3e5reuk.apps.googleusercontent.com';