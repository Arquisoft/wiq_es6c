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
    continente: {
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

const monumentSchema = new mongoose.Schema({
    monumento: {
        type: String,
        required: true
    },
    pais: {
        type: String,
        required: false
    }
}, {timestamps: {}});

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

const filmSchema = new mongoose.Schema({
    pelicula: {
        type: String,
        required: true
    },
    director: {
        type: String,
        required: false
    }
}, {timestamps: {}});

const songSchema = new mongoose.Schema({
    cancion: {
        type: String,
        required: true
    },
    artista: {
        type: String,
        required: false
    }
}, {timestamps: {}});

const Pais = mongoose.model('Pais', paisSchema);
const Monumento = mongoose.model('Monumento', monumentSchema);
const Elemento = mongoose.model('Elemento', chemicalElementsSchema);
const Pelicula = mongoose.model('Pelicula', filmSchema);
const Cancion = mongoose.model('Cancion', songSchema);

module.exports = {
    Pais,
    Monumento,
    Elemento,
    Pelicula,
    Cancion
};