const mongoose = require('mongoose');

const questionStorageSchema = new mongoose.Schema({
    pregunta: {
        type: String,
        required: true,
    },
    respuesta_correcta: { 
        type: String, 
        required: true 
    },
    respuestas_incorrectas: [{ 
        type: String, 
        required: true 
    }],
    createdAt: {
        type: Date,
        required: true,
        default: Date.now, 
      },
});

const Question = mongoose.model('Question', questionStorageSchema);

module.exports = Question;
