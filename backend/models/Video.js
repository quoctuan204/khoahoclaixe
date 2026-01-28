const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoId: { type: String, required: true }, // ID của video YouTube (ví dụ: dQw4w9WgXcQ)
  description: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', videoSchema);