const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
      type: String,
      required: true,
  },
  tpoints: {
      type: Number,
      required: true,
  },
  ttime: {
    type: Number,
    required: true,
  },
  ngames: {
    type: Number,
    required: true,
  },

});

const User = mongoose.model('User', userSchema);

module.exports = User