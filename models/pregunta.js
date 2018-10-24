var mongoose = require('mongoose');

var Schema = mongoose.Schema

var preguntaSchema = new Schema({
    titulo: {type: String, required: [true, 'El nombre de la pregunta en  necesario']},
    descripcion: {type: String},
    encuesta: {type:Schema.Types.ObjectId,ref:'Encuesta', required: [true, 'El id de encuesta es requerido']},
    tipoPregunta: {type:Schema.Types.ObjectId,ref:'TipoPregunta', required: [true, 'EL id TipoPregunta es requerido']},
}); 

module.exports = mongoose.model('Pregunta', preguntaSchema);