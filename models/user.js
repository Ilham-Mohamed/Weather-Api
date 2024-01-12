const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    required: true,
    type: String,
  },
  location: {
    required: true,
    type: String,
  },
  weatherData: [
    {
      date: { type: Date, default: Date.now },
      data: Object,
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
