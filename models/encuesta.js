var mongoose = require('mongoose');


var Schema = mongoose.Schema;


var encuestaSchema = new Schema({
    titulo: {type: String, required: [true, 'el titulo es necesario']},
    descripcion: {type: String},
    usuario: {type:Schema.Types.ObjectId,ref:'Usuario'}
})

module.exports = mongoose.model('Encuesta', encuestaSchema);