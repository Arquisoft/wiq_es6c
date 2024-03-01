const express = require('express');
const mongoose = require('mongoose');
const {Question} = require('./questiongenerator-model')
const {Request} = require('./questiongenerator-model')

const app = express();
const port = 8006; 

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/questions';
mongoose.connect(mongoUri);
const db = mongoose.connection;
db.on('error', (error) => console.error(`MongoDB connection error: ${error}`));
db.once('open', () => console.log("Connected to MongoDB: %s", mongoUri));

// Middleware to parse JSON in request body
app.use(express.json());

// Route for getting questions
app.get('/questions', async (req, res) => {
  try {
    const request = new Request({
      n_preguntas: Number(req.body.n_preguntas),
      n_respuestas: Number(req.body.n_respuestas),
      tema: req.body.tema
    });

    // TODO: Implement logic to fetch questions from MongoDB and send response 
    // const questions = await Question.find()
    // res.json(questions)
    const defaultQuestion = new Question({
      pregunta: "¿Cómo me llamo?",
      respuestas: ["Abel", "Federico", "Eusebio", "Gervasio"]
    });
    res.json(defaultQuestion);
  } catch (error) {
    // res.status(500).json({ message: error.message })
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.use((err, req, res, next) => {
  console.error(`An error occurred: ${err}`);
  res.status(500).send(`An error occurred: ${err.message}`);
});

// Start the server
const server = app.listen(port, () => {
  console.log(`Questions Service listening at http://localhost:${port}`);
});

server.on('close', () => {
    // Close the Mongoose connection
    mongoose.connection.close();
  });

module.exports = server
