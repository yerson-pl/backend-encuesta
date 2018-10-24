var mongoose = require('mongoose');

var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} No es un rol valido'
}

var usuarioSchema = new Schema({
    name: {type: String, required: [true, 'El nombre es necesario']},
    email: {type: String, unique:true, required: [true, 'El correo es necesario']},
    password: {type: String, required: [true, 'La contraseña es necesario']},
    img: {type: String,  required: false},
    dni: {type: Number, unique: true, required: [true, 'EL DNI es obligatorio'] },
    role: {type: String, required: true, default: 'USER_ROLE', enum: rolesValidos} 

});

usuarioSchema.plugin( uniqueValidator, {
    message: 'EL {PATH} debe ser único'
})

module.exports = mongoose.model('Usuario', usuarioSchema);