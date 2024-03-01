const mongoose = require('mongoose');

const questionStorageSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    c_answer: { type: String, required: true },
    w_answers: [{ type: String, required: true }],
    createdAt: {
        type: Date,
        default: Date.now, 
      },
});

const Question = mongoose.model('Question', questionStorageSchema);

module.exports = Question;
