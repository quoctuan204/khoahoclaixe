const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin', enum: ['admin', 'staff', 'superadmin', 'editor', 'sale'] },
  fullName: String,
  email: String,
  avatar: String,
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  lockoutCount: { type: Number, default: 0 },
  twoFactorCode: String,
  twoFactorExpires: Date,
  twoFactorAttempts: { type: Number, default: 0 },
  resetPasswordCode: String,
  resetPasswordExpires: Date,
  resetPasswordAttempts: { type: Number, default: 0 },
  resetRequestCount: { type: Number, default: 0 },
  resetRequestWindowStart: Date
});

module.exports = mongoose.model('Admin', adminSchema);