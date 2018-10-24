var express = require('express');
var app = express();

var Encuesta = require('../models/encuesta');
var TipoPregunta = require('../models/tipoPregunta');
var Pregunta = require('../models/pregunta');
var Usuario = require('../models/usuario');

//busqueda por coleccion

app.get('/coleccion/:tabla/:busqueda', (req, res)=>{
    let busqueda = req.params.busqueda;
    let tabla = req.params.tabla;
    let regex = new RegExp(busqueda, 'i');
    let promesa;

    switch(tabla){
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;
        case 'encuestas':
            promesa = buscarEncuestas(busqueda, regex);
            break;
        default:
            return res.status(400).json({
                ok:false,
                mensaje: 'los tipos de busquedas solo son : Usuario, Encuesta',
                err: {messaje: 'Coleccion no valida'} 
            });
    }
    promesa.then( data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        })
    })

});



// Busquedas general

app.get('/todo/:busqueda', (req, res, next)=>{

    let busqueda = req.params.busqueda;
    let regex = new RegExp( busqueda, 'i')


    Promise.all([
        buscarEncuestas(busqueda, regex), 
        buscarTipoPreguntas(busqueda, regex),
        buscarPreguntas(busqueda, regex),
        buscarUsuarios(busqueda, regex)])
    .then(respuestas =>
        {
        res.status(200).json({
            ok: true,
            mensaje: 'Peticion realizada correctamente - busqueda',
            encuestas: respuestas[0],
            tipoPreguntas: respuestas[1],
            preguntas: respuestas[2],
            usuarios: respuestas[3] 
        });
    })
});


function buscarEncuestas(busqueda, regex){

    return new Promise((resolve, reject)=>{

    Encuesta.find({titulo:regex }, (err, encuestas)=>{
            if(err){
                reject('Error al cargar encuestas', err);
            }else{
                resolve(encuestas);
            }   
        });
    });

}


function buscarTipoPreguntas(busqueda, regex){

    return new Promise((resolve, reject)=>{

    TipoPregunta.find({titulo:regex }, (err, tipoPreguntas)=>{
            if(err){
                reject('Error al cargar tipoPreguntas', err);
            }else{
                resolve(tipoPreguntas);
            }   
        });
    });

}


function buscarPreguntas(busqueda, regex){

    return new Promise((resolve, reject)=>{

    Pregunta.find({titulo:regex }, (err, preguntas)=>{
            if(err){
                reject('Error al cargar tipoPreguntas', err);
            }else{
                resolve(preguntas);
            }   
        });
    });

}

function buscarUsuarios(busqueda, regex){

    return new Promise((resolve, reject)=>{

    Usuario.find()
            .or([{'name': regex}, {'email': regex}])
            .exec((err, usuarios)=>{
                if(err){
                    reject('Error al cargar usuarios', err);
                }else{
                    resolve( usuarios)
                }
            });                                                                                                                                                                                                                                                                                                                     
    });

}

module.exports = app;