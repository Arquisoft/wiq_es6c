const express = require('express');
const cron = require('node-cron');
const mongoose = require('mongoose');
const WikiQueries = require('./wikidataQueries');
const { Pais } = require('./wikidataextractor-model');

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

async function extractData() {
    var data = await WikiQueries.obtenerPaisYLenguaje();
    console.log(data);
    var paises = data.map(function (element) {
        var p = {
            updateOne: {
                filter: { pais: String(element.countryLabel) },
                update: {
                    capital: element.capitalLabel,
                    lenguaje: element.languageLabel,
                    bandera: element.flagLabel
                },
                upsert: true
            }
        };
        console.log(p);
        return p;
    });
    await Pais.bulkWrite(paises);

    return paises;
}

var minutes = 30;
cron.schedule(`*/${minutes} * * * *`, () => {
    console.log(`Running a task every ${minutes} minutes: ${Date()}`);
    // Call function here
    extractData();
});

 /* 
    ALL ROUTES ARE ONLY FOR DEVELOPING PURPOSES, THEY SHOULD GET DELETED IN PRODUCTION 
    THIS SERVICE SHOULD NOT BE ACCESSIBLE FROM OUTSIDE
 */

// Route for extracting countries
// app.get('/extract', async (req, res) => {
//     try {
//         res.json(await extractData());
//     } catch (error) {
//         res.status(500).json({ message: error.message })
//         // res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// // Route for geting countries
// app.get('/countries', async (req, res) => {
//     try {
//         const paises = await Pais.find({})
//         res.json(paises);
//     } catch (error) {
//         res.status(500).json({ message: error.message })
//         // res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// // Route for deleting countries
// app.delete('/countries', async (req, res) => {
//     try {
//         const paises = await Pais.deleteMany({})
//         res.json(paises);
//     } catch (error) {
//         res.status(500).json({ message: error.message })
//         // res.status(500).json({ error: 'Internal Server Error' });
//     }
// });


app.use((err, req, res, next) => {
    console.error(`An error occurred: ${err}`);
    res.status(500).send(`An error occurred: ${err.message}`);
});

// Start the server
const server = app.listen(port, () => {
    console.log(`Questions Service listening at http://localhost:${port}`);
});

server.on('close', () => {
    // Close the Mongoose connection
    mongoose.connection.close();
});

module.exports = server