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

// Read the OpenAPI YAML file synchronously
const file = fs.readFileSync('./openapi.yaml', 'utf8');

// Parse the YAML content into a JavaScript object representing the Swagger document
const swaggerDocument = YAML.parse(file);

// Serve the Swagger UI documentation at the '/api-doc' endpoint
// This middleware serves the Swagger UI files and sets up the Swagger UI page
// It takes the parsed Swagger document as input
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware to parse JSON in request body
app.use(express.json());

// Middleware to enable CORS (cross-origin resource sharing). In order for the API to be accessible by other origins (domains).
app.use(cors());

var gameId = 0;


// Route for getting questions
app.get('/gameUnlimitedQuestions', async (req, res) => {
  try {
    console.log("Llegamos al nuevo servicio")
    // TODO: Implement logic to fetch questions from MongoDB and send response 
    // const questions = await Question.find()
    console.log("Antes de incrementar: ", gameId)
    const questionGenerated = await axios.get(`${questionService}/questions?n_preguntas=${1}`);
    gameId = gameId + 1
    console.log("Despues de incrementar: ", gameId)
    res.json(questionGenerated.data);
  } catch (error) {
    // res.status(500).json({ message: error.message })
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

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
