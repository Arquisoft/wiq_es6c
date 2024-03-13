const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const { Question } = require('./questiongenerator-model')

const app = express();
const port = 8006;

const questionHistoryServiceUrl = process.env.STORE_QUESTION_SERVICE_URL || 'http://localhost:8004';

const WikiQueries = require('./wikidataExtractor/wikidataQueries');
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

var mockedQuestions = [];
var isWikiChecked = false;
var elementos;

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

const generateQuestion = async () => {
  if (!isWikiChecked) {
    elementos = await WikiQueries.obtenerPaisYCapital();
    isWikiChecked = true;
  }
  elementos = shuffle(elementos);
  mockedQuestions = [{
    pregunta: "¿Cual es la capital de " + elementos[0].countryLabel + "?",
    respuesta_correcta: elementos[0].capitalLabel,
    respuestas_incorrectas: [elementos[1].capitalLabel, elementos[2].capitalLabel, elementos[3].capitalLabel]
  }];
  console.log(mockedQuestions);
}


// const mockedQuestions = [
//   {
//     pregunta: "¿Cómo me llamo?",
//     respuesta_correcta: "Abel",
//     respuestas_incorrectas: ["Federico", "Eusebio", "Gervasio"]
//   },
//   {
//     pregunta: "¿Cuál es el río más largo del mundo?",
//     respuesta_correcta: "Amazonas",
//     respuestas_incorrectas: ["Nilo", "Misisipi", "Yangtsé"]
//   },
//   {
//     pregunta: "¿En qué año comenzó la Segunda Guerra Mundial?",
//     respuesta_correcta: "1939",
//     respuestas_incorrectas: ["1941", "1942", "1945"]
//   },
//   {
//     pregunta: "¿Quién escribió 'El Quijote'?",
//     respuesta_correcta: "Miguel de Cervantes",
//     respuestas_incorrectas: ["Garcilaso de la Vega", "Federico García Lorca", "Pablo Neruda"]
//   },
//   {
//     pregunta: "¿Cuál es el símbolo químico del oro?",
//     respuesta_correcta: "Au",
//     respuestas_incorrectas: ["Ag", "Fe", "Cu"]
//   },
//   {
//     pregunta: "¿Cuál es el planeta más grande del sistema solar?",
//     respuesta_correcta: "Júpiter",
//     respuestas_incorrectas: ["Saturno", "Marte", "Venus"]
//   },
//   {
//     pregunta: "¿Quién pintó la 'Mona Lisa'?",
//     respuesta_correcta: "Leonardo da Vinci",
//     respuestas_incorrectas: ["Pablo Picasso", "Vincent van Gogh", "Rembrandt"]
//   },
//   {
//     pregunta: "¿En qué país se encuentra la Torre Eiffel?",
//     respuesta_correcta: "Francia",
//     respuestas_incorrectas: ["Italia", "España", "Alemania"]
//   },
//   {
//     pregunta: "¿Qué año marcó el fin de la Segunda Guerra Mundial?",
//     respuesta_correcta: "1945",
//     respuestas_incorrectas: ["1943", "1944", "1946"]
//   },
//   {
//     pregunta: "¿Quién escribió 'Romeo y Julieta'?",
//     respuesta_correcta: "William Shakespeare",
//     respuestas_incorrectas: ["Jane Austen", "Charles Dickens", "F. Scott Fitzgerald"]
//   },
//   {
//     pregunta: "¿Qué inventó Thomas Edison?",
//     respuesta_correcta: "Bombilla eléctrica",
//     respuestas_incorrectas: ["Teléfono", "Automóvil", "Avión"]
//   }
// ]

// Function to generate the required number of questions
async function getQuestions(req) {
  const { n_preguntas, n_respuestas, tema } = req.query;
  var preguntas = Number(n_preguntas);
  var respuestas = Number(n_respuestas);
  var temad = String(tema);

  // if (isNaN(preguntas)) {
  //   generateQuestion()
  //   console.log("merda", mockedQuestions)
  //   return mockedQuestions.slice(0, 4);
  // }
  // const response = [];
  await generateQuestion();
  // for (let i = 0; i < preguntas; i++) {
  //   response.push(mockedQuestions[i % 11]);
  // }
  return mockedQuestions;
}

// Route for getting questions
app.get('/questions', async (req, res) => {
  try {
    // TODO: Implement logic to fetch questions from MongoDB and send response 
    // const questions = await Question.find()
    const defaultQuestion = await getQuestions(req);

    const questionsHistoryResponse = await axios.post(questionHistoryServiceUrl + '/history/questions', defaultQuestion);
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
