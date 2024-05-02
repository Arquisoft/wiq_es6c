const express = require('express');
const axios = require('axios');
const cors = require('cors');
const promBundle = require('express-prom-bundle');

const app = express();
const port = 8100;

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
     res.status(500).json({ error: 'Internal server error' });
  }
}

app.use(metricsMiddleware);

app.get('/users', async (req, res) => {
  try {
    const response = await axios.get(userServiceUrl+`/users`);
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

app.get('/usersStats', async (req, res) => {
  try {
    const users = await axios.get(userStatsServiceUrl+`/history/users`);
    
    const usersInformation = users.data.map(user => ({
      username: user.username,
      tpoints: user.tpoints,
      avgpoints: user.tpoints / user.ngames,
      ttime: user.ttime,
      avgtime: user.ttime / user.ngames,
      createdAt: user.createdAt
    }));

    res.json(usersInformation);
  } catch (error) {
    catchAction(error, res)
  }
})

//libraries required for OpenAPI-Swagger
const swaggerUi = require('swagger-ui-express'); 
const fs = require("fs")
const YAML = require('yaml')


// Read the OpenAPI YAML file synchronously
const openapiPath='./openapi.yaml'
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
