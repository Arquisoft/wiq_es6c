const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const { QuestionGenerator } = require('./questiongenerator')

const app = express();
const port = 8007;

const questionHistoryServiceUrl = process.env.STORE_QUESTION_SERVICE_URL || 'http://localhost:8004';

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/questions';
mongoose.connect(mongoUri);
const db = mongoose.connection;
db.on('error', (error) => console.error(`MongoDB connection error: ${error}`));
db.once('open', () => console.log("Connected to MongoDB: %s", mongoUri));

// Middleware to parse JSON in request body
app.use(express.json());

// Middleware to enable CORS (cross-origin resource sharing). In order for the API to be accessible by other origins (domains).
app.use(cors());

// Only parse query parameters into strings, not objects (adds security)
app.set('query parser', 'simple');

function validateNumberInQuery(number, minValue, paramName, defValue) {
  if (!(paramName in number)) return defValue;
  n = Number(number[paramName]);
  if (isNaN(n)) throw new Error(`A number was expected in param \'${paramName}\'`);
  if (n < minValue) throw new Error(`\'${paramName}\' must be at least \'${minValue}\'`);
  return n;
}

// Function to validate required fields in the request body
function validateFields(query) {
  const preguntas = validateNumberInQuery(query, 1, 'n_preguntas', 1);
  const respuestas = validateNumberInQuery(query, 1, 'n_respuestas', 4);
  var temas = query.tema || [];
  if (!Array.isArray(temas)) {
    temas = Array.of(temas);
  }
  return { preguntas, respuestas, temas };
}

// Route for getting questions
app.get('/questions', async (req, res) => {
  try {
    const { preguntas, respuestas, temas } = validateFields(req.query);
    try {
      const retQuestions = await QuestionGenerator.generateQuestions(preguntas, respuestas, temas);
      try {
        await axios.post(questionHistoryServiceUrl + '/history/questions', retQuestions);
      } catch (error) {
        console.error(`Error saving questions history: ${error}`);
      }
      res.json(retQuestions);
    } catch (error) {
      console.error(`An error occurred: ${error.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } catch (error) {
    console.error(`Bad Request: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
});

// Route for getting topics for questions
app.get('/topics', async (req, res) => {
  try {
    const topics = QuestionGenerator.getAvailableTopics();
    res.send(topics);
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

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
