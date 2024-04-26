const mongoose = require('mongoose');

const paisSchema = new mongoose.Schema({
    pais: {
        type: String,
        required: true
    },
    capital: {
        type: String,
        required: false
    },
    lenguaje: {
        type: String,
        required: false
    },
    bandera: {
        type: String,
        required: false
    }
}, { timestamps: {} }); // Añade y gestiona automáticamente los campos createdAt y updatedAt

const chemicalElementsSchema = new mongoose.Schema({
    elemento: {
        type: String,
        required: true
    },
    simbolo: {
        type: String,
        required: false
    }
}, {timestamps: {}});


const Pais = mongoose.model('Pais', paisSchema);
const Elemento = mongoose.model('Element', chemicalElementsSchema);

module.exports = {
    Pais,
    Elemento
};