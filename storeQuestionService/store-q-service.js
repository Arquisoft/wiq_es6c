const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Question = require('./store-q-model');

const app = express();
const port = 8004;

// Middleware to parse JSON in request body
app.use(express.json());

// Middleware to enable CORS (cross-origin resource sharing). In order for the API to be accessible by other origins (domains).
app.use(cors());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/storedquestion';
mongoose.connect(mongoUri);

// Function to validate required fields in the request body
function validateRequiredFields(body, requiredFields) {
    for (const field of requiredFields) {
        if (!(field in body)) {
            throw new Error(`Missing required field: ${field}`);
        }
    }
}

app.post('/history/question', async (req, res) => {
    try {
        // Check if required fields are present in the request body
        validateRequiredFields(req.body, ['pregunta', 'respuesta_correcta', 'respuestas_incorrectas']);

        const newQuestion = new Question({
            pregunta: req.body.pregunta,
            respuesta_correcta: req.body.respuesta_correcta,
            respuestas_incorrectas: req.body.respuestas_incorrectas,
            createdAt: req.body.createdAt
        });

        await newQuestion.save();
        res.json(newQuestion);
    } catch (error) {
        res.status(400).json({ error: error.message || 'An error occurred'});
    }
});

app.post('/history/questions', async (req, res) => {
    try {
        // Check if required fields are present in the request body
        if (!Array.isArray(req.body)) {
            throw new Error('Invalid request format. Expected an array of questions.');
        }
        for (const question of req.body) {
            validateRequiredFields(question, ['pregunta', 'respuesta_correcta', 'respuestas_incorrectas']);
        }
        const newQuestions = [];

        for (const questionData of req.body) {
            const newQuestion = new Question({
                pregunta: questionData.pregunta,
                respuesta_correcta: questionData.respuesta_correcta,
                respuestas_incorrectas: questionData.respuestas_incorrectas,
                createdAt: questionData.createdAt
            });

            await newQuestion.save();
            newQuestions.push(newQuestion);
        }

        res.json(newQuestions);
    } catch (error) {
        res.status(400).json({ error: error.message || 'An error occurred'});
    }
});


app.get('/history/questions', async (req, res) => {
    try {
        const questions = await Question.find({}); // Get all questions
        res.json(questions.sort(question => question.createdAt).reverse());
    } catch (error) {
        res.status(500).json({ error: error.message || 'An error occurred'});
    }
});

//libraries required for OpenAPI-Swagger
const swaggerUi = require('swagger-ui-express'); 
const fs = require("fs")
const YAML = require('yaml')


// Read the OpenAPI YAML file synchronously
openapiPath='./openapi.yaml'
if (fs.existsSync(openapiPath)) {
  const file = fs.readFileSync(openapiPath, 'utf8');

  // Parse the YAML content into a JavaScript object representing the Swagger document
  const swaggerDocument = YAML.parse(file);

  // Serve the Swagger UI documentation at the '/api-doc' endpoint
  // This middleware serves the Swagger UI files and sets up the Swagger UI page
  // It takes the parsed Swagger document as input
  app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
  console.log("Not configuring OpenAPI. Configuration file not present.")
}


const server = app.listen(port, () => {
    console.log(`Store questions service listening at http://localhost:${port}`);
});

// Listen for the 'close' event on the Express.js server
server.on('close', () => {
    // Close the Mongoose connection
    mongoose.connection.close();
});

module.exports = server;
