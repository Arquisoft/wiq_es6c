const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');

//libraries required for OpenAPI-Swagger
const swaggerUi = require('swagger-ui-express'); 
const fs = require("fs")
const YAML = require('yaml')

const app = express();
const port = 8005;

const questionService = process.env.QUESTIONS_GENERATOR_SERVICE_URL || 'http://localhost:8007';
const userStatsService = process.env.STORE_STATS_SERVICE ||'http://localhost:8003';

// Read the OpenAPI YAML file synchronously
const file = fs.readFileSync('./openapi.yaml', 'utf8');

// Parse the YAML content into a JavaScript object representing the Swagger document
const swaggerDocument = YAML.parse(file);

function generateAleatoryString() {
  let characters = 'abcdefghijklmnopqrstuvwxyz0123456789'; // Caracteres alfanuméricos
  let len = 24;
  let result = '';
  for (let i = 0; i < len; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Serve the Swagger UI documentation at the '/api-doc' endpoint
// This middleware serves the Swagger UI files and sets up the Swagger UI page
// It takes the parsed Swagger document as input
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware to parse JSON in request body
app.use(express.json());

// Middleware to enable CORS (cross-origin resource sharing). In order for the API to be accessible by other origins (domains).
app.use(cors());

var gameId = 0;

app.get('/generateGameUnlimitedQuestions', async (req, res) => {
  try {
    console.log("Llegamos a crear un id del juego")
    var gameId = generateAleatoryString()
    res.json(gameId)
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
})


// Route for getting questions
app.get('/gameUnlimitedQuestions', async (req, res) => {
  try {
    // TODO: Implement logic to fetch questions from MongoDB and send response 
    // const questions = await Question.find()
    console.log("Llegamos a pedir preguntas")
    const questionGenerated = await axios.get(`${questionService}/questions?n_preguntas=${1}`);
    console.log("Pedimos las preguntas")
    res.json(questionGenerated.data);
  } catch (error) {
    // res.status(500).json({ message: error.message })
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/storeGame', async (req, res) => {
  try {
    //hay que preparar los datos para enviarlos al servicio
    var data;
    const store = await axios.post(`${userStatsService}/history/game`, data)
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.use((err, req, res, next) => {
  console.error(`An error occurred: ${err}`);
  res.status(500).send(`An error occurred: ${err.message}`);
});

// Start the server
const server = app.listen(port, () => {
  console.log(`Game Service listening at http://localhost:${port}`);
});

server.on('close', () => {
  // Close the Mongoose connection
});

module.exports = server
