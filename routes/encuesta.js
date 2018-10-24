// Rutas
var express = require('express');
//var bcrypt = require('bcryptjs');
// var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');
// var SEED = require('../config/config').SEED;

var app = express();


var Encuesta = require('../models/encuesta')


//Obtener todos las encuestas
app.get('/', (req, res, next)=>{
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Encuesta.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'name email dni')
        .exec(
            (err, encuestas) =>{
                if(err){
                    return res.status(500).json({
                        ok: false,
                        messaje: 'Error cargando encuestas',
                        errors: err
                    });
                }

                Encuesta.count({}, (err, conteo)=>{
                    res.status(200).json({
                        ok: true,
                        encuestas: encuestas,
                        total: conteo
                    });
                });
                
            })
});


//Actualizar encuesta
app.put('/:id', mdAutenticacion.verificaToken, (req, res)=>{
    var id = req.params.id;
    var body = req.body

    Encuesta.findById(id, (err, encuesta)=>{

        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar encuesta",
                errors: err
            });
        }

        if( !encuesta ){
            return res.status(400).json({
                ok:false,
                mensaje: "La encuesta con el id: " + id + "node existe",
                errors: {messaje: 'No existe la encuesta con ese ID'}
            });
        }

        encuesta.titulo = body.titulo;
        encuesta.descripcion = body.descripcion;
        encuesta.usuario = req.usuario._id;
        

        encuesta.save((err, encuestaGuardado)=>{
            if(err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error al actualizar encuesta",
                    errors: err
                });
            }
            
            res.status(200).json({
                ok: true,
                encuesta: encuestaGuardado
            });
        });
    });

});

//Crear una nueva encuesta
app.post('/', mdAutenticacion.verificaToken, (req, res)=>{
    var body = req.body;

    var encuesta = new Encuesta({
        titulo: body.titulo,
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })

    encuesta.save( (err, encuestaGuardado)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                messaje: 'Error al crear encuesta',
                errors: err
            });
        } 
        
        res.status(201).json({
            ok: true,
            encuesta: encuestaGuardado,
            usuarioToken: req.usuario
        });
    } );


}) 


// Borrar Encuesta por ID
app.delete('/:id', mdAutenticacion.verificaToken, (req, res)=>{
    var id = req.params.id

    Encuesta.findByIdAndRemove(id, (err, encuestaBorrado)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                messaje: 'Error al borrar encuesta',
                errors: err
            });
        } 

        if(!encuestaBorrado){
            return res.status(400).json({
                ok: false,
                messaje: 'No existe esa encuesta con el ID',
                errors: {messaje: 'No existe esa encuesta con el ID'}
            });
        } 
        
        res.status(200).json({
            ok: true,
            encuesta: encuestaBorrado
        });
    });
});

module.exports = app;