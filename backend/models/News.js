const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: String,
  content: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('News', newsSchema);