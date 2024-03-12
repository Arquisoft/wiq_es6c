// user-stats-service.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Game = require('./game-stats-model');

const app = express();
const port = 8003;

// Middleware to parse JSON in request body
app.use(bodyParser.json());

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

app.post('/addgame', async (req, res) => {
    try {
        // Check if required fields are present in the request body
        validateRequiredFields(req, ['id', 'points', 'username', 'questions']);

        const newGame = new Game({
            id: req.body.id,
            username: req.body.username,
            points: req.body.points,
            questions: req.body.questions,
        });

        await newGame.save();
        res.json(newGame);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/getgame', async (req, res) => {
    try {
        // Check if required fields are present in the query parameters
        validateRequiredFields(req.query, ['username']);

        const { username } = req.query;

        // Find the user by username in the database
        const user = await Game.findOne({ username });

        // Check if the user exists
        if (user) {
            // Respond with the user information
            res.json({
                id: user.id,
                username: user.username,
                points: user.points,
                questions: user.questions,
                createdAt: user.createdAt
            });
        } else {
            res.status(404).json({ error: 'User not found!' });
        }
    } catch (error) {
        // Handle errors during database query
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/getgames', async (req, res) => {
    try {
        // Check if required fields are present in the query parameters
        validateRequiredFields(req.query, ['username']);

        const { username } = req.query;

        // Find all games by username in the database with function find
        const games = await Game.find({ username });

        // Check if any games exist
        if (games.length > 0) {
            // Respond with the array of games using map
            const gamesData = games.map(game => ({
                id: game.id,
                username: game.username,
                points: game.points,
                questions: game.questions,
                createdAt: game.createdAt
            }));
            res.json(gamesData);
        } else {
            res.status(404).json({ error: 'No games found for the user!' });
        }
    } catch (error) {
        // Handle errors during database query
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


const server = app.listen(port, () => {
    console.log(`User Stats Service listening at http://localhost:${port}`);
});

// Listen for the 'close' event on the Express.js server
server.on('close', () => {
    // Close the Mongoose connection
    mongoose.connection.close();
});

module.exports = server;
