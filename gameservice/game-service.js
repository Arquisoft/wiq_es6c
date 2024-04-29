const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 8005;

const questionService = process.env.QUESTIONS_GENERATOR_SERVICE_URL || 'http://localhost:8007';
const userStatsService = process.env.STORE_STATS_SERVICE ||'http://localhost:8003';

function generateAleatoryString() {
  let characters = 'abcdefghijklmnopqrstuvwxyz0123456789'; // Caracteres alfanuméricos
  let len = 24;
  let result = '';
  for (let i = 0; i < len; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}


// Middleware to parse JSON in request body
app.use(express.json());

// Middleware to enable CORS (cross-origin resource sharing). In order for the API to be accessible by other origins (domains).
app.use(cors());

var gameId = 0;

app.get('/generateGame', async (req, res) => {
    console.log("Llegamos a crear un id del juego")
    var gameId = generateAleatoryString()
    res.json(gameId)
})


// Route for getting questions
app.get('/questions', async (req, res) => {
  try {
    // TODO: Implement logic to fetch questions from MongoDB and send response 
    // const questions = await Question.find()
    const questionGenerated = await axios.get(questionService + req.url);
    res.json(questionGenerated.data);
  } catch (error) {
    // res.status(500).json({ message: error.message })
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/storeGame', async (req, res) => {
  try {
    //hay que preparar los datos para enviarlos al servicio
    var id = req.body.id
    var username = req.body.username
    var points = req.body.points
    var questions = req.body.questions
    var avgtime = req.body.avgtime
    console.log("Vamos a guardar resultado")
    const store = await axios.post(`${userStatsService}/history/game`, {id, points, username, questions, avgtime})
    console.log("Guardamos resultado")
    res.json(store.data)
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.get('/topics', async (req, res) => {
  try {
    const topics = await axios.get(`${questionService}/topics`)
    res.json(topics.data)
  } catch (error) { 
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.use((err, req, res, next) => {
  console.error(`An error occurred: ${err}`);
  res.status(500).send(`An error occurred: ${err.message}`);
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

// Start the server
const server = app.listen(port, () => {
  console.log(`Game Service listening at http://localhost:${port}`);
});

server.on('close', () => {
  // Close the Mongoose connection
});

module.exports = server
