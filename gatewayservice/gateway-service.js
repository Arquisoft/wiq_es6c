const express = require('express');
const axios = require('axios');
const cors = require('cors');
const promBundle = require('express-prom-bundle');

const app = express();
const port = 8000;

const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:8002';
const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:8001';
const storeQuestionsServiceUrl = process.env.STORE_QUESTION_SERVICE_URL || 'http://localhost:8004'
// const questionsGeneratorServiceUrl = process.env.QUESTIONS_GENERATOR_SERVICE_URL || 'http://localhost:8007'
const gameService = process.env.GAME_SERVICE_URL || 'http://localhost:8005'

app.use(cors());
app.use(express.json());

//Prometheus configuration
const metricsMiddleware = promBundle({includeMethod: true});
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
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.post('/adduser', async (req, res) => {
  try {
    // Forward the add user request to the user service
    const userResponse = await axios.post(userServiceUrl+'/adduser', req.body);
    res.json(userResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.get('/history/questions', async (req, res) => {
  try {
    const response = await axios.get(storeQuestionsServiceUrl+'/history/questions');
    res.json(response.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
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

app.get('/gameUnlimitedQuestions', async (req, res) => {
  try {
    console.log("Antes de la llamada")
    const response = await axios.get(gameService + `/gameUnlimitedQuestions`)
    console.log(response.data)
    res.json(response.data)
  } catch (error) {
    res.status(error.response.status).json({error: error.response.data.error})
  }
})

// Start the gateway service
const server = app.listen(port, () => {
  console.log(`Gateway Service listening at http://localhost:${port}`);
});

module.exports = server
