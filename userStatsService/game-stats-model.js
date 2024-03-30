const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  id: {
      type: Number,
      required: true,
  },
  username: {
      type: String,
      required: true,
  },
  points: {
      type: Number,
      required: true,
  },
  questions: [{
      title: {
          type: String,
          required: true,
      },
      answers: [{
          type: String,
          required: true,
      }],
      ansIndex: [{
          type: Number,
          required: true,
      }]
  }],
  createdAt: {
      type: Date,
      default: Date.now,
  },
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game