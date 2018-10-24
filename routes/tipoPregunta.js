// Rutas
var express = require('express');
//var bcrypt = require('bcryptjs');
// var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');
// var SEED = require('../config/config').SEED;

var app = express();


var TipoPregunta = require('../models/tipoPregunta')


//Obtener todos los tipos de preguntas
app.get('/', (req, res, next)=>{
    let desde = req.query.desde || 0;
    desde = Number(desde);
    
    TipoPregunta.find({})
        .skip(desde)
        .limit(5)
        .exec(
            (err, tipoPreguntas) =>{
                if(err){
                    return res.status(500).json({
                        ok: false,
                        messaje: 'Error cargando tipoPreguntas',
                        errors: err
                    });
                }

                TipoPregunta.count({}, (err, conteo)=>{
                    res.status(200).json({
                        ok: true,
                        tipoPreguntas: tipoPreguntas,
                        total: conteo
                    });
                })
            } 
        )
        
});


//Actualizar Tipo Preguntas
app.put('/:id', mdAutenticacion.verificaToken, (req, res)=>{
    var id = req.params.id;
    var body = req.body

    TipoPregunta.findById(id, (err, tipoPregunta)=>{

        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar tipo-pregunta",
                errors: err
            });
        }

        if( !tipoPregunta ){
            return res.status(400).json({
                ok:false,
                mensaje: "El tipo de pregunta con el id: " + id + "node existe",
                errors: {messaje: 'No existe el tipo de pregunta con ese ID'}
            });
        }

        tipoPregunta.descripcion = body.descripcion;        

        tipoPregunta.save((err, tipoPreguntaGuardado)=>{
            if(err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error al actualizar tipo-pregunta",
                    errors: err
                });
            }
            
            res.status(200).json({
                ok: true,
                tipoPregunta: tipoPreguntaGuardado
            });
        });
    });

});

//Crear un Nuevo TipoPregunta
app.post('/', mdAutenticacion.verificaToken, (req, res)=>{
    var body = req.body;

    var tipoPregunta = new TipoPregunta({
        descripcion: body.descripcion
    })

    tipoPregunta.save( (err, tipoPreguntaGuardado)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                messaje: 'Error al crear tipo-Pregunta',
                errors: err
            });
        } 
        
        res.status(201).json({
            ok: true,
            tipoPregunta: tipoPreguntaGuardado,
            usuarioToken: req.usuario
        });
    } );


}); 


// Borrar TipoPregunta por ID
app.delete('/:id', mdAutenticacion.verificaToken, (req, res)=>{
    var id = req.params.id

    TipoPregunta.findByIdAndRemove(id, (err, tipoPreguntaBorrado)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                messaje: 'Error al borrar tipo-pregunta',
                errors: err
            });
        } 

        if(!tipoPreguntaBorrado){
            return res.status(400).json({
                ok: false,
                messaje: 'No existe tipo-pregunta con el ID',
                errors: {messaje: 'No existe tipo-pregunta encuesta con el ID'}
            });
        } 
        
        res.status(200).json({
            ok: true,
            tipoPregunta: tipoPreguntaBorrado
        });
    });
});

module.exports = app;