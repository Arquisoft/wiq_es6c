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
}, {timestamps: {}}); // Añade y gestiona automáticamente los campos createdAt y updatedAt


const Pais = mongoose.model('Pais', paisSchema);

module.exports = {
    Pais
};