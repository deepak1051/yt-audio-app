const mongoose = require('mongoose');

const audioSchema = new mongoose.Schema({
  title: String,
  url: String,
});

const Audio = mongoose.model('Audio', audioSchema);
module.exports = Audio;
