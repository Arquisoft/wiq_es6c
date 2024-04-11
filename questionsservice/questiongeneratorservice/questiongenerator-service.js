const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const { Pais } = require('./questiongenerator-model')

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

function shuffle(array) {
  let currentIndex = array.length;
  let randomIndex;
  // Mientras queden elementos para mezclar.
  while (currentIndex > 0) {
    // Escoge un elemento aleatorio.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // Intercambia el elemento actual con el elemento aleatorio.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

async function generateQuestion() {
  var elementos = await Pais.find({ capital: { $exists: true } }).exec();
  console.log("Find:\n" + elementos)
  elementos = shuffle(elementos);
  var mockedQuestions = [{
    pregunta: "¿Cual es la capital de " + elementos[0].pais + "?",
    respuesta_correcta: elementos[0].capital,
    respuestas_incorrectas: [elementos[1].capital, elementos[2].capital, elementos[3].capital]
  }];
  console.log(mockedQuestions);
  return mockedQuestions
}

// Function to generate the required number of questions
async function getQuestions(req) {
  const { n_preguntas, n_respuestas, tema } = req.query;
  var preguntas = Number(n_preguntas);
  var respuestas = Number(n_respuestas);
  var temas = String(tema);

  // if (isNaN(preguntas)) {
  //   generateQuestion()
  //   console.log("merda", mockedQuestions)
  //   return mockedQuestions.slice(0, 4);
  // }
  // const response = [];
  //  generateQuestion();
  // for (let i = 0; i < preguntas; i++) {
  //   response.push(mockedQuestions[i % 11]);
  // }
  return await generateQuestion();
}

// Route for getting questions
app.get('/questions', async (req, res) => {
  try {
    // TODO: Implement logic to fetch questions from MongoDB and send response 
    // const questions = await Question.find()
    const defaultQuestion = await getQuestions(req);

    try{
      const questionsHistoryResponse = await axios.post(questionHistoryServiceUrl + '/history/questions', defaultQuestion);
    } catch (error) {
      console.error(`Error saving questions history: ${error}`);
    }
    res.json(defaultQuestion);
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
  console.log(`Questions Service listening at http://localhost:${port}`);
});

server.on('close', () => {
  // Close the Mongoose connection
  mongoose.connection.close();
});

module.exports = server
