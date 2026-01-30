const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  centerName: { type: String, default: '' },
  address: { type: String, default: '' },
  hotline: { type: String, default: '' },
  email: { type: String, default: '' },
  zalo: { type: String, default: '' },
  facebook: { type: String, default: '' },
  maintenanceMode: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);