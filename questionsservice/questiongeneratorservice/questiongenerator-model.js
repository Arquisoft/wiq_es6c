const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    pregunta: {
        type: String,
        required: true
    },
    respuestas: {
        type: [String],
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const requestSchema = new mongoose.Schema({
    n_preguntas: {
        type: Number,
        required: true,
        default: 1
    },
    n_respuestas: {
        type: Number,
        required: true,
        default: 4
    },
    tema: {
        type: String,
        required: true,
        default: "todos"
    }
});

const Question = mongoose.model('Question', questionSchema);
const Request = mongoose.model('Request', requestSchema);

module.exports = {
    Question,
    Request
};