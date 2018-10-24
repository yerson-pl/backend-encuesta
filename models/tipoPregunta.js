var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var tipoPreguntaSchema = new Schema({
    descripcion: {type: String, required: [true, 'EL tipo de pregunta es necesario']}
});

module.exports = mongoose.model('TipoPregunta', tipoPreguntaSchema);