const cron = require('node-cron');
const mongooseUri = (process.env.DATAMODELS_URI === undefined) ? '../node_modules/mongoose' : 'mongoose';
const mongoose = require(mongooseUri);
const WikiQueries = require('./wikidataQueries');
const modelUri = process.env.DATAMODELS_URI || '../questiondata-model';
const { Pais, Monumento, Elemento, Pelicula, Cancion } = require(modelUri);


// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/questions';
mongoose.connect(mongoUri);
const db = mongoose.connection;
db.on('error', (error) => console.error(`MongoDB connection error: ${error}`));
db.once('open', () => console.log("Connected to MongoDB: %s", mongoUri));

function close() {
    mongoose.connection.close();
    mongoose.disconnect();
}

const templates = [
    {
        extractMethod: () => WikiQueries.obtenerPaisYCapital(),
        filtro: (element) => { return { pais: String(element.countryLabel) } },
        campo_actualizar: (element) => { return { capital: element.capitalLabel } },
        saveMethod: (transactions) => Pais.bulkWrite(transactions)
    },
    {
        extractMethod: () => WikiQueries.obtenerPaisYContinente(),
        filtro: (element) => { return { pais: String(element.countryLabel) } },
        campo_actualizar: (element) => { return { continente: element.continentLabel } },
        saveMethod: (transactions) => Pais.bulkWrite(transactions)
    },
    {
        extractMethod: () => WikiQueries.obtenerMonumentoYPais(),
        filtro: (element) => { return { monumento: String(element.monumentLabel) } },
        campo_actualizar: (element) => { return { pais: element.countryLabel } },
        saveMethod: (transactions) => Monumento.bulkWrite(transactions)
    },
    {
        extractMethod: () => WikiQueries.obtenerSimboloQuimico(),
        filtro: (element) => { return { elemento: String(element.elementLabel) } },
        campo_actualizar: (element) => { return { simbolo: element.symbol } },
        saveMethod: (transactions) => Elemento.bulkWrite(transactions)
    },
    {
        extractMethod: () => WikiQueries.obtenerPeliculaYDirector(),
        filtro: (element) => { return { pelicula: String(element.peliculaLabel) } },
        campo_actualizar: (element) => { return { director: element.directorLabel } },
        saveMethod: (transactions) => Pelicula.bulkWrite(transactions)
    },
    {
        extractMethod: () => WikiQueries.obtenerCancionYArtista(),
        filtro: (element) => { return { cancion: String(element.songLabel) } },
        campo_actualizar: (element) => { return { artista: element.artistLabel } },
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

async function startJob(minutes = 30, startQuery = 0) {
    const totalQueries = templates.length;
    let query = startQuery % totalQueries;
    cron.schedule(`*/${minutes} * * * *`, async () => {
        try {
            console.log(`Running a task every ${minutes} minutes: ${Date()}`);
            await extractData(templates[query]);
            query = (query + 1) % totalQueries;
        } catch (error) {
            console.error(error.message)
        }
    });
}

startJob();

module.exports = { startJob, extractData, close };