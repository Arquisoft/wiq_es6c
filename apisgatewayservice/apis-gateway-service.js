const express = require('express');
const axios = require('axios');
const cors = require('cors');
const promBundle = require('express-prom-bundle');

const app = express();
const port = 8010;

const storeQuestionsServiceUrl = process.env.STORE_QUESTION_SERVICE_URL || 'http://localhost:8004'
const userStatsServiceUrl = process.env.USER_STATS_SERVICE_URL || 'http://localhost:8003';
const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:8001';

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

app.get('/users', async (req, res) => {
  try {
    const response = await axios.get(`${userServiceUrl}/users`);
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

// Start the gateway service
const server = app.listen(port, () => {
  console.log(`Gateway Service listening at http://localhost:${port}`);
});

module.exports = server
