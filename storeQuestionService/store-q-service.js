const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Question = require('./store-q-model');

const app = express();
const port = 8004;

// Middleware to parse JSON in request body
app.use(express.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/storedquestion';
mongoose.connect(mongoUri);

// Function to validate required fields in the request body
function validateRequiredFields(req, requiredFields) {
    for (const field of requiredFields) {
        if (!(field in req.body)) {
            throw new Error(`Missing required field: ${field}`);
        }
    }
}

app.post('/history/questions', async (req, res) => {
    try {
        // Check if required fields are present in the request body
        validateRequiredFields(req, ['pregunta', 'respuesta_correcta','respuestas_incorrectas']);

        const newQuestion = new Question({
            pregunta: req.body.pregunta,
            respuesta_correcta: req.body.respuesta_correcta,
            respuestas_incorrectas: req.body.respuestas_incorrectas,
            createdAt: req.body.createdAt
        });

        await newQuestion.save();
        res.json(newQuestion);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/addquestions', async (req, res) => {
  try {
      // Check if required fields are present in the request body
      if (!Array.isArray(req.body)) {
          throw new Error('Invalid request format. Expected an array of questions.');
      }
      for (const question of req.body) {
          validateRequiredFields(question, ['pregunta', 'respuesta_correcta','respuestas_incorrectas']);
      }

      const newQuestions = [];

      for (const questionData of req.body) {
        const newQuestion = new Question({
            pregunta: req.body.pregunta,
            respuesta_correcta: req.body.respuesta_correcta,
            respuestas_incorrectas: req.body.respuestas_incorrectas,
            createdAt: req.body.createdAt
        });

        await newQuestion.save();
        newQuestions.push(newQuestion);
      }
      
      res.json(newQuestions);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});


app.get('/history/questions', async (req, res) => {
    try {
        res.setHeader("Access-Control-Allow-Origin", "*");//Puede ser innecesario?
        const questions = await Question.find({}); // Get all questions
        res.json(questions);
        /*res.json([{ //FORMATO VIEJO
            question: '¿Cuál es la capital de la comunidad autónoma de Casstilla y León?',
            answers: ['Segovia','León','Valladolid','Ninguna'],
          }]);*/
        /*res.json([{
            pregunta: '¿Cuál es la capital de la comunidad autónoma de Castilla y León?',
            respuesta_incorrecta: 'Ninguna',
            respuestas_incorrectas: ['Segovia','León','Valladolid']
          }]);*/
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const server = app.listen(port, () => {
    console.log(`Store questions service listening at http://localhost:${port}`);
});

// Listen for the 'close' event on the Express.js server
server.on('close', () => {
    // Close the Mongoose connection
    mongoose.connection.close();
});

module.exports = server;
