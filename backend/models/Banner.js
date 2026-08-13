const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: { type: String, required: true },
  link: String,
  buttonText: String,
  order: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Banner', bannerSchema);
