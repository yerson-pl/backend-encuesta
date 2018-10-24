// Rutas
var express = require('express');
//var bcrypt = require('bcryptjs');
// var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');
// var SEED = require('../config/config').SEED;

var app = express();


var Pregunta = require('../models/pregunta')


//Obtener todos las preguntas
//app.get('/', (req, res, next)=>{
//
//    Pregunta.find({}, (err, preguntas)=>{
//        if(err){
//            return res.status(500).json({
//                ok: false,
//                messaje: 'Error cargando preguntas',
//                errors: err
//            });
//        }
//        res.status(200).json({
//            ok: true,
//            preguntas: preguntas
//        });
//        
//    });
//
//});

app.get('/', (req, res, next)=>{

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Pregunta.find({})
        .skip(desde)
        .limit(5)
        .populate('encuesta')
        .populate('tipoPregunta')
        .exec(
            (err, preguntas) =>{
                if(err){
                    return res.status(500).json({
                        ok: false,
                        messaje: 'Error cargando preguntas',
                        errors: err
                    });
                }

                Pregunta.count({}, (err, conteo)=>{
                    res.status(200).json({
                        ok: true,
                        preguntas: preguntas,
                        total:conteo
                    });

                })
            } 
        )
        
});


//Actualizar pregunta
app.put('/:id', mdAutenticacion.verificaToken, (req, res)=>{
    var id = req.params.id;
    var body = req.body

    Pregunta.findById(id, (err, pregunta)=>{

        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar pregunta",
                errors: err
            });
        }

        if( !pregunta ){
            return res.status(400).json({
                ok:false,
                mensaje: "La pregunta con el id: " + id + "node existe",
                errors: {messaje: 'No exste la pregunta con ese ID'}
            });
        }

        pregunta.encuesta = body.encuesta;
        pregunta.tipoPregunta = body.tipoPregunta;
        pregunta.titulo = body.titulo;
        pregunta.descripcion = body.descripcion;        

        pregunta.save((err, preguntaGuardado)=>{
            if(err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error al actualizar pregunta",
                    errors: err
                });
            }
            
            res.status(200).json({
                ok: true,
                pregunta: preguntaGuardado
            });
        });
    });

});

//Crear una nueva pregunta
app.post('/', mdAutenticacion.verificaToken, (req, res)=>{
    var body = req.body;

    var pregunta = new Pregunta({
        encuesta:body.encuesta,
        tipoPregunta: body.tipoPregunta,
        titulo: body.titulo,
        descripcion: body.descripcion,
    })

    pregunta.save( (err, preguntaGuardado)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                messaje: 'Error al crear pregunta',
                errors: err
            });
        } 
        
        res.status(201).json({
            ok: true,
            pregunta: preguntaGuardado,
            usuarioToken: req.usuario
        });
    } );


}) 


// Borrar Pregunta por ID
app.delete('/:id', mdAutenticacion.verificaToken, (req, res)=>{
    var id = req.params.id

    Pregunta.findByIdAndRemove(id, (err, preguntaBorrado)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                messaje: 'Error al borrar pregunta',
                errors: err
            });
        } 

        if(!preguntaBorrado){
            return res.status(400).json({
                ok: false,
                messaje: 'No existe esa pregunta con el ID',
                errors: {messaje: 'No existe esa pregunta con el ID'}
            });
        } 
        
        res.status(200).json({
            ok: true,
            pregunta: preguntaBorrado
        });
    });
});

module.exports = app;