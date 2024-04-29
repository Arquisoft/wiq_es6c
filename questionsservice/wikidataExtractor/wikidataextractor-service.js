const express = require('express');
const cron = require('node-cron');
const mongoose = require('mongoose');
const WikiQueries = require('./wikidataQueries');
const modelUri = process.env.DATAMODELS_URI || '../questiondata-model';
const { Pais, Monumento, Elemento, Pelicula, Cancion } = require(modelUri);

const app = express();
const port = 8008;

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/questions';
mongoose.connect(mongoUri);
const db = mongoose.connection;
db.on('error', (error) => console.error(`MongoDB connection error: ${error}`));
db.once('open', () => console.log("Connected to MongoDB: %s", mongoUri));

// Middleware to parse JSON in request body
app.use(express.json());

const templates = [
    {
        extractMethod: () => WikiQueries.obtenerPaisYCapital(),
        filtro: (element) => { return { pais: String(element.countryLabel) }},
        campo_actualizar: (element) => { return { capital: element.capitalLabel }},
        saveMethod: (transactions) => Pais.bulkWrite(transactions)
    },
    {
        extractMethod: () => WikiQueries.obtenerPaisYContinente(),
        filtro: (element) => { return { pais: String(element.countryLabel) }},
        campo_actualizar: (element) => { return { continente: element.continentLabel }},
        saveMethod: (transactions) => Pais.bulkWrite(transactions)
    },
    {
        extractMethod: () => WikiQueries.obtenerMonumentoYPais(),
        filtro: (element) => { return { monumento: String(element.monumentLabel) }},
        campo_actualizar: (element) => { return { pais: element.countryLabel }},
        saveMethod: (transactions) => Monumento.bulkWrite(transactions)
    },
    // {
    //     extractMethod: () => WikiQueries.obtenerPaisYLenguaje(),
    //     filtro: (element) => { return { pais: String(element.countryLabel) }},
    //     campo_actualizar: (element) => { return { lenguaje: element.languageLabel }},
    //     saveMethod: (transactions) => Pais.bulkWrite(transactions)
    // },
    // {
    //     extractMethod: () => WikiQueries.obtenerPaisYBandera(),
    //     filtro: (element) => { return { pais: String(element.countryLabel) }},
    //     campo_actualizar: (element) => { return { bandera: element.flagLabel }},
    //     saveMethod: (transactions) => Pais.bulkWrite(transactions)
    // },
    {
        extractMethod: () => WikiQueries.obtenerSimboloQuimico(),
        filtro: (element) => { return { elemento: String(element.elementLabel) }},
        campo_actualizar: (element) => { return { simbolo: element.symbol }},
        saveMethod: (transactions) => Elemento.bulkWrite(transactions)
    },
    {
        extractMethod: () => WikiQueries.obtenerPeliculaYDirector(),
        filtro: (element) => { return { pelicula: String(element.peliculaLabel) }},
        campo_actualizar: (element) => { return { director: element.directorLabel }},
        saveMethod: (transactions) => Pelicula.bulkWrite(transactions)
    },
    {
        extractMethod: () => WikiQueries.obtenerCancionYArtista(),
        filtro: (element) => { return { cancion: String(element.songLabel) }},
        campo_actualizar: (element) => { return { artista: element.artistLabel }},
        saveMethod: (transactions) => Cancion.bulkWrite(transactions)
    }
];

async function extractData(template) {
    console.log("Actualizando los datos sobre:")
    const data = await template.extractMethod();
    console.log(data);
    const transactions = data.map(function (element) {
        let transaction = {
            updateOne: {
                filter: template.filtro(element),
                update: template.campo_actualizar(element),
                upsert: true
            }
        };
        return transaction;
    });
    await template.saveMethod(transactions);

    return transactions;
}

const minutes = 1;
const totalQueries = templates.length;
let query = 0;
cron.schedule(`*/${minutes} * * * *`, () => {
    try {
        console.log(`Running a task every ${minutes} minutes: ${Date()}`);
        extractData(templates[query]);
        query = (query+1)%totalQueries;
    } catch (error) {
        console.error(error.message)
    }
    
});

app.use((err, req, res, next) => {
    console.error(`An error occurred: ${err}`);
    res.status(500).send(`An error occurred: ${err.message}`);
});

// Start the server
const server = app.listen(port, () => {
    console.log(`Wikidata Extractor listening at http://localhost:${port}`);
});

server.on('close', () => {
    // Close the Mongoose connection
    mongoose.connection.close();
});

module.exports = server