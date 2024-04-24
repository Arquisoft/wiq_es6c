const express = require('express');
const axios = require('axios');
const cors = require('cors');
const promBundle = require('express-prom-bundle');

const app = express();
const port = 8000;

const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:8002';
const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:8001';
const userStatsServiceUrl = process.env.USER_STATS_SERVICE_URL || 'http://localhost:8003';
const storeQuestionsServiceUrl = process.env.STORE_QUESTION_SERVICE_URL || 'http://localhost:8004'
// const questionsGeneratorServiceUrl = process.env.QUESTIONS_GENERATOR_SERVICE_URL || 'http://localhost:8007'
const gameService = process.env.GAME_SERVICE_URL || 'http://localhost:8005'

app.use(cors());
app.use(express.json());

//Prometheus configuration
const metricsMiddleware = promBundle({includeMethod: true});

function catchAction(error, res) {
  if ('response' in error && 'status' in error.response && 'data' in error.response && 'error' in error.response.data)
    res.status(error.response.status).json({ error: error.response.data.error });
  else if('response' in error && 'status' in error.response){
    res.status(error.response.status).json({ error: 'Unknown error' });
  } else {
    console.log("Unknown error: " + error);
  }
  // } else {
  //   res.status(500).json({ error: 'Internal server error' });
  // }
}

app.use(metricsMiddleware);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'OK' });
});

app.post('/login', async (req, res) => {
  try {
    // Forward the login request to the authentication service
    const authResponse = await axios.post(authServiceUrl+'/login', req.body);
    res.json(authResponse.data);
  } catch (error) {
    catchAction(error, res);
  }
});

app.post('/adduser', async (req, res) => {
  try {
    // Forward the add user request to the user service
    const userResponse = await axios.post(userServiceUrl+'/adduser', req.body);
    res.json(userResponse.data);
  } catch (error) {
    catchAction(error, res)
  }
});

app.get('/history/games/:username', async (req, res) => {
  try {
    const safeUsername = encodeURIComponent(req.params.username);
    const url = `${userStatsServiceUrl}/history/games/${safeUsername}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    catchAction(error, res)
  }
})

app.get('/history/questions', async (req, res) => {
  try {
    const response = await axios.get(storeQuestionsServiceUrl+'/history/questions');
    res.json(response.data);
  } catch (error) {
    catchAction(error, res)
  }
})

// app.get(`/questions`, async (req, res) => {
//   try {
//     const response = await axios.get(questionsGeneratorServiceUrl+`/questions`);
//     res.json(response.data);
//   } catch (error) {
//     res.status(error.response.status).json({ error: error.response.data.error });
//   }
// })

app.get('/generateGame', async (req, res) => {
  try {
    const response = await axios.get(gameService + '/generateGame')
    res.json(response.data)
  } catch (error) {
    catchAction(error, res)
  }
})

app.get('/questions', async (req, res) => {
  try {
    console.log("Antes de la llamada")
    console.log(req.query)

    const response = await axios.get(gameService + req.url)
    console.log(response.data)
    res.json(response.data)
  } catch (error) {
    catchAction(error, res)
  }
})

app.post('/storeGame', async (req, res) => {
  try {
    var id = req.body.id
    var username = req.body.username
    var points = req.body.points
    var questions = req.body.questions
    console.log(questions)
    console.log("Hacemos la llamada al guardar preguntas")
    const post = await axios.post(gameService + `/storeGame`, {id, username,  points, questions})
    console.log("Devuelve la llamada")
    res.json(post.data) 
  } catch (error) {
    catchAction(error, res)
  }
})

app.get('/topics', async (req, res) => {
  try {
    const response = await axios.get(`${gameService}/topics`)
    res.json(response.data)
  } catch (error) {
    catchAction(error, res)
  }
})

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


// Start the gateway service
const server = app.listen(port, () => {
  console.log(`Gateway Service listening at http://localhost:${port}`);
});

module.exports = server
