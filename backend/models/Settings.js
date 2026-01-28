const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  address: String,
  hotline: String,
  email: String,
  maintenanceMode: { type: Boolean, default: false }
});

module.exports = mongoose.model('Settings', settingsSchema);