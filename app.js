// Requires
require('./config/config');
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


//Inicializar variables
var app = express();

//BodyParser
app.use(bodyParser.urlencoded( {extended: false}))

app.use(bodyParser.json())

//Importar rutas
var appRoutes = require('./routes/app')
var usuarioRoutes = require('./routes/usuario')
var loginRoutes = require('./routes/login')
var encuestaRoutes = require('./routes/encuesta')
var tipoPreguntaRoutes = require('./routes/tipoPregunta')
var preguntaRoutes = require('./routes/pregunta')
let opcionPreguntaRoutes = require('./routes/opcionPregunta')
let busquedaRoutes = require('./routes/busqueda')
let resultadoRoutes = require('./routes/resultado')
let uploadRoutes = require('./routes/upload')







//Conexion a BD 
mongoose.connection.openUri(process.env.URLDB, (err, res)=>{
    if(err) throw err;
    console.log('Base de datos');
});


// Rutas
app.use('/upload', uploadRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/pregunta', preguntaRoutes);
app.use('/tipo-pregunta', tipoPreguntaRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/encuesta',encuestaRoutes);
app.use('/opcion-pregunta', opcionPreguntaRoutes);
app.use('/resultado',resultadoRoutes);
app.use('/', appRoutes);


// Escuchar peticiones

app.listen(process.env.PORT, ()=>{
    console.log('Express corriendo', process.env.PORT);  
})