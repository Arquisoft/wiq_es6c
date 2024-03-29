// user-stats-service.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Game = require('./game-stats-model');

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
                questions: user.questions,
                createdAt: user.createdAt
            }));
            res.json(userInformation.slice(0, req.query.limit || userInformation.length));
        } else {
            res.status(404).json({ error: 'User not found!' });
        }
    } catch (error) {
        // Handle errors during database query
        res.status(500).json({ error: error.message });
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
