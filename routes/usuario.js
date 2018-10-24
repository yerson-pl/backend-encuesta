// Rutas
var express = require('express');
var bcrypt = require('bcryptjs');
// var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');
// var SEED = require('../config/config').SEED;

var app = express();


var Usuario = require('../models/usuario')


//Obtener todos los usuarios

app.get('/', (req, res, next)=>{

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({})
        .skip(desde)
        .limit(5)
        .populate('encuesta')
        .populate('tipoPregunta')
        .exec(
            (err, usuarios) =>{
                if(err){
                    return res.status(500).json({
                        ok: false,
                        messaje: 'Error cargando usuarios',
                        errors: err
                    });
                }

                Usuario.count({}, (err, conteo)=>{
                    res.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        total:conteo
                    });

                })
            } 
        )
        
});


//Actualizar Usuario
app.put('/:id', mdAutenticacion.verificaToken, (req, res)=>{
    var id = req.params.id;
    var body = req.body

    Usuario.findById(id, (err, usuario)=>{

        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar usuario",
                errors: err
            });
        }

        if( !usuario ){
            return res.status(400).json({
                ok:false,
                mensaje: "El usuario con el id: " + id + "node existe",
                errors: {messaje: 'No exste el usuario con ese ID'}
            });
        }

        usuario.name = body.name,
        usuario.email = body.email,
        usuario.dni = body.dni,
        usuario.role = body.role

        usuario.save((err, usuarioGuardado)=>{
            if(err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error al actualizar usuario",
                    errors: err
                });
            }
            usuarioGuardado.password = ':)'
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });

});

//Crear un nuevo usuario
app.post('/', mdAutenticacion.verificaToken, (req, res)=>{
    var body = req.body;

    var usario = new Usuario({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        dni: body.dni,
        role: body.role
    })

    usario.save( (err, usuarioGuardado)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                messaje: 'Error al crear usuario',
                errors: err
            });
        } 
        
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });
    } );


})


// Borrar Usuario por ID
app.delete('/:id',mdAutenticacion.verificaToken,  (req, res)=>{
    var id = req.params.id

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                messaje: 'Error al borrar usuario',
                errors: err
            });
        } 

        if(!usuarioBorrado){
            return res.status(400).json({
                ok: false,
                messaje: 'No existe ese usuario con el ID',
                errors: {messaje: 'No existe ese usuario con el ID'}
            });
        } 
        
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;