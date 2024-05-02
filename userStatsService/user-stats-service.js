// user-stats-service.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Game = require('./game-stats-model');
const User = require('./user-stats-model');

const app = express();
const port = 8003;

// Middleware to parse JSON in request body
app.use(express.json());

// Middleware to enable CORS (cross-origin resource sharing). In order for the API to be accessible by other origins (domains).
app.use(cors());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/statsdb';
mongoose.connect(mongoUri);

// Function to validate required fields in the request body
function validateRequiredFields(req, requiredFields) {
    for (const field of requiredFields) {
        if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
            throw new Error(`Missing required field: ${field}`);
        }
    }
}

app.post('/history/game', async (req, res) => {
    try {
        // Check if required fields are present in the request body
        validateRequiredFields(req, ['id', 'points', 'username', 'questions', 'avgtime']);

        const query = { username: req.body.username.toString() }

        // Find user by username in the database
        let user = await User.findOne(query);

        if (!user) {
            // If the user doesn't exist, create a new user entry
            user = new User({
                username: req.body.username,
                tpoints: req.body.points,
                ttime: req.body.avgtime,
                ngames: 1,
                createdAt: new Date()
            });
        } else {
            // If the user exists, update the user's information
            user.tpoints += req.body.points;
            user.ttime += req.body.avgtime;
            user.ngames += 1;
        }

        // Save the updated user information
        await user.save();

        // Create new game entry
        const newGame = new Game({
            id: req.body.id,
            username: req.body.username,
            points: req.body.points,
            avgtime: req.body.avgtime,
            questions: req.body.questions,
        });
        await newGame.save();

        res.json(newGame);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


app.get('/history/games/:username', async (req, res) => {
    try {
        const { username } = req.params;

        // Find users by username in the database
        const users = await Game.find({ username });

        // Check if any users were found
        if (users.length > 0) {
            // Respond with the users' information
            const userInformation = users.map(user => ({
                id: user.id,
                username: user.username,
                points: user.points,
                avgtime: user.avgtime,
                questions: user.questions,
                createdAt: user.createdAt
            }));
            res.json(userInformation.slice(0, req.query.limit || userInformation.length).reverse());
        } else {
            res.status(404).json({ error: 'User not found!' });
        }
    } catch (error) {
        // Handle errors during database query
        res.status(500).json({ error: error.message });
    }
});

app.get('/history/games', async (req, res) => {
    try {
        // Find users' games in the database
        const games = await Game.find();

        // Respond with the users' games information
        const gamesInformation = games.map(game => ({
            id: user.id,
            username: user.username,
            points: user.points,
            avgtime: user.avgtime,
            questions: user.questions,
            createdAt: user.createdAt
        }));

        res.json(gamesInformation);

    } catch (error) {
        // Handle errors during database query
        res.status(500).json({ error: error.message });
    }
});

app.get('/history/users', async (req, res) => {
    try {
        // Find users in the database
        const users = await User.find();

        // Respond with the users' information
        const usersInformation = users.map(user => ({
            username: user.username,
            tpoints: user.tpoints,
            ttime: user.ttime,
            ngames: user.ngames,
            createdAt: user.createdAt
        }));

        res.json(usersInformation);

    } catch (error) {
        // Handle errors during database query
        res.status(500).json({ error: error.message });
    }
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


const server = app.listen(port, () => {
    console.log(`User Stats Service listening at http://localhost:${port}`);
});

// Listen for the 'close' event on the Express.js server
server.on('close', () => {
    // Close the Mongoose connection
    mongoose.connection.close();
});

module.exports = server;