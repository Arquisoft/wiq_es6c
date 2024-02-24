const mongoose = require('mongoose');

const questionStorageSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    answers: [{ type: String, required: true }],
});

const Question = mongoose.model('Question', questionStorageSchema);

module.exports = Question;
