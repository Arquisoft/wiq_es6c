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
const questionsGeneratorServiceUrl = process.env.QUESTIONS_GENERATOR_SERVICE_URL || 'http://localhost:8007'

app.use(cors());
app.use(express.json());

//Prometheus configuration
const metricsMiddleware = promBundle({includeMethod: true});

function catchAction(error, res) {
  if ('response' in error && 'status' in error.response && 'data' in error.response && 'error' in error.response.data)
    res.status(error.response.status).json({ error: error.response.data.error });
  else if('response' in error && 'status'){
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

app.get(`/questions`, async (req, res) => {
  try {
    const response = await axios.get(questionsGeneratorServiceUrl+`/questions`);
    res.json(response.data);
  } catch (error) {
    catchAction(error, res)
  }
})

// Start the gateway service
const server = app.listen(port, () => {
  console.log(`Gateway Service listening at http://localhost:${port}`);
});

module.exports = server
