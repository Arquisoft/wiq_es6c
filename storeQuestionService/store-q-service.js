const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Question = require('./store-q-model');

const app = express();
const port = 8004;

// Middleware to parse JSON in request body
app.use(bodyParser.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/storedquestion';
mongoose.connect(mongoUri);

// Function to validate required fields in the request body
function validateRequiredFields(req, requiredFields) {
    for (const field of requiredFields) {
        if (!(field in req.body)) {
            throw new Error(`Missing required field: ${field}`);
        }
    }
}

app.post('/addquestion', async (req, res) => {
    try {
        // Check if required fields are present in the request body
        validateRequiredFields(req, ['question', 'c_answer','w_answers']);

        const newQuestion = new Question({
            question: req.body.question,
            c_answer: req.body.answers,
            w_answers: req.body.answers,
        });

        await newQuestion.save();
        res.json(newQuestion);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/addquestions', async (req, res) => {
  try {
      // Check if required fields are present in the request body
      if (!Array.isArray(req.body)) {
          throw new Error('Invalid request format. Expected an array of questions.');
      }
      for (const question of req.body) {
          validateRequiredFields(question, ['question', 'c_answer','w_answers']);
      }

      const newQuestions = [];

      for (const questionData of req.body) {
        const newQuestion = new Question({
            question: req.body.question,
            c_answer: req.body.answers,
            w_answers: req.body.answers,
        });

        await newQuestion.save();
        newQuestions.push(newQuestion);
      }
      
      res.json(newQuestions);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});


app.get('/questions', async (req, res) => {
    try {
        const questions = await Question.find({}); // Get all questions
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const server = app.listen(port, () => {
    console.log(`Store questions service listening at http://localhost:${port}`);
});

// Listen for the 'close' event on the Express.js server
server.on('close', () => {
    // Close the Mongoose connection
    mongoose.connection.close();
});

module.exports = server;
