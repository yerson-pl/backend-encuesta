module.exports.SEED = '@este-es@-un-seed-dificil';

process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_env || 'dev';


//Base de datos
let urlDB;
if( process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/encuestaDB';
}else{
    urlDB = 'mongodb://user-encuesta:encuesta1234@ds141043.mlab.com:41043/encuesta-db'
}

process.env.URLDB = urlDB;