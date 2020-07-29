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
// Bade de datos
//======================
let urlBD;
if (process.env.NODE_ENV === 'dev') {
    urlBD = 'mongodb://localhost:27017/cafe';
} else {
    urlBD = 'mongodb+srv://admin:admin@cluster0.e1mzw.mongodb.net/cafe';
}

process.env.URLDB = urlBD;