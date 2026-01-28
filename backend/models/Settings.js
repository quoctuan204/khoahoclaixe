const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  address: String,
  hotline: String,
  email: String
});

module.exports = mongoose.model('Settings', settingsSchema);