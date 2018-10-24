// Rutas
var express = require('express');
//var bcrypt = require('bcryptjs');
// var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');
// var SEED = require('../config/config').SEED;

var app = express();


var Resultado = require('../models/resultado')


//Obtener todos los resultados
app.get('/', (req, res, next)=>{
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Resultado.find({})
        .skip(desde)
        .limit(5)
        .populate('pregunta')
        .exec(
            (err, resultados) =>{
                if(err){
                    return res.status(500).json({
                        ok: false,
                        messaje: 'Error cargando resultados',
                        errors: err
                    });
                }

                Resultado.count({}, (err, conteo)=>{
                    res.status(200).json({
                        ok: true,
                        resultados: resultados,
                        total: conteo
                    });
                });
                
            })
});


//Actualizar resultados
app.put('/:id', mdAutenticacion.verificaToken, (req, res)=>{
    var id = req.params.id;
    var body = req.body

    Resultado.findById(id, (err, resultado)=>{

        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar resultado",
                errors: err
            });
        }

        if( !resultado ){
            return res.status(400).json({
                ok:false,
                mensaje: "El resultado con el id: " + id + "node existe",
                errors: {messaje: 'No exste la resultado con ese ID'}
            });
        }

        resultado.pregunta = body.pregunta;
        resultado.valor = body.valor;
        

        resultado.save((err, resultadoGuardado)=>{
            if(err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error al actualizar resultado",
                    errors: err
                });
            }
            
            res.status(200).json({
                ok: true,
                resultado: resultadoGuardado
            });
        });
    });

});

//Crear una nueva Resultado
app.post('/', mdAutenticacion.verificaToken, (req, res)=>{
    var body = req.body;

    var resultado = new Resultado({
        valor: body.valor,
        pregunta: body.pregunta
    })

    resultado.save( (err, resultadoGuardado)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                messaje: 'Error al crear resultado',
                errors: err
            });
        } 
        
        res.status(201).json({
            ok: true,
            resultado: resultadoGuardado,
            usuarioToken: req.usuario
        });
    } );


}) 


// Borrar Resultado por ID
app.delete('/:id', mdAutenticacion.verificaToken, (req, res)=>{
    var id = req.params.id

    Resultado.findByIdAndRemove(id, (err, resultadoBorrado)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                messaje: 'Error al borrar resultado',
                errors: err
            });
        } 

        if(!resultadoBorrado){
            return res.status(400).json({
                ok: false,
                messaje: 'No existe esa resultado con el ID',
                errors: {messaje: 'No existe esa resultado con el ID'}
            });
        } 
        
        res.status(200).json({
            ok: true,
            resultado: resultadoBorrado
        });
    });
});

module.exports = app;