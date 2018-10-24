var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var resultadoSchema = new Schema({
    pregunta: {type:Schema.Types.ObjectId,ref:'Pregunta', required:[true, 'Es necesario la pregunta']},
    valor: {type:String}
})

module.exports = mongoose.model('Resultado', resultadoSchema)