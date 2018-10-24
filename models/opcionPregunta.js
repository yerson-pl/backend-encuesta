var mongoose = require('mongoose');

var Schema = mongoose.Schema


var opcionPreguntaSchema = new Schema({
    pregunta: {type:Schema.Types.ObjectId,ref:'Pregunta', required: [true, 'la pregunta es necesaria']},
    valor: {type: String}
});

module.exports = mongoose.model('OpcionPregunta', opcionPreguntaSchema);
