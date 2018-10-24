// Rutas
var express = require('express');
//var bcrypt = require('bcryptjs');
// var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');
// var SEED = require('../config/config').SEED;

var app = express();


var OpcionPregunta = require('../models/opcionPregunta')

app.get('/', (req, res, next)=>{

    let desde = req.query.desde || 0;
    desde = Number(desde);

    OpcionPregunta.find({})
        .skip(desde)
        .limit(5)
        .populate('pregunta')
        .exec(
            (err, opcionPreguntas) =>{
                if(err){
                    return res.status(500).json({
                        ok: false,
                        messaje: 'Error cargando opcionPreguntas',
                        errors: err
                    });
                }

                OpcionPregunta.count({}, (err, conteo)=>{
                    res.status(200).json({
                        ok: true,
                        opcionPreguntas: opcionPreguntas,
                        total:conteo
                    });

                })
            } 
        )
        
});


//Actualizar Opcionpregunta
app.put('/:id', mdAutenticacion.verificaToken, (req, res)=>{
    var id = req.params.id;
    var body = req.body

    OpcionPregunta.findById(id, (err, opcionPregunta)=>{

        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar opcion-pregunta",
                errors: err
            });
        }

        if( !opcionPregunta ){
            return res.status(400).json({
                ok:false,
                mensaje: "La opcion - pregunta con el id: " + id + "no existe",
                errors: {messaje: 'No existe la opcion - pregunta con ese ID'}
            });
        }

        opcionPregunta.valor = body.valor;
        opcionPregunta.pregunta = body.pregunta;
        

        opcionPregunta.save((err, opcionPreguntaGuardado)=>{
            if(err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error al actualizar opcion - pregunta",
                    errors: err
                });
            }
            
            res.status(200).json({
                ok: true,
                opcionPregunta: opcionPreguntaGuardado
            });
        });
    });

});

//Crear una nueva pregunta
app.post('/', mdAutenticacion.verificaToken, (req, res)=>{
    var body = req.body;

    var opcionPregunta = new OpcionPregunta({
        valor: body.valor,
        pregunta: body.pregunta
    })

    opcionPregunta.save( (err, opcionPreguntaGuardado)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                messaje: 'Error al crear opcion-pregunta',
                errors: err
            });
        } 
        
        res.status(201).json({
            ok: true,
            opcionPregunta: opcionPreguntaGuardado,
            usuarioToken: req.usuario
        });
    } );


}) 


// Borrar OpcionPregunta por ID
app.delete('/:id', mdAutenticacion.verificaToken, (req, res)=>{
    var id = req.params.id

    OpcionPregunta.findByIdAndRemove(id, (err, opcionPreguntaBorrado)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                messaje: 'Error al borrar opcionPregunta',
                errors: err
            });
        } 

        if(!opcionPreguntaBorrado){
            return res.status(400).json({
                ok: false,
                messaje: 'No existe esa opcion - pregunta con el ID',
                errors: {messaje: 'No existe esa opcion -pregunta con el ID'}
            });
        } 
        
        res.status(200).json({
            ok: true,
            opcionPregunta: opcionPreguntaBorrado
        });
    });
});

module.exports = app;