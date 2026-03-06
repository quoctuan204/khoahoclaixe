const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin', enum: ['admin', 'staff', 'superadmin', 'editor', 'sale'] },
  fullName: String,
  email: String,
  avatar: String, // URL to avatar image
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  lockoutCount: { type: Number, default: 0 }, // Đếm cấp độ khóa (0: chưa, 1: 15p, 2+: 24h)
  twoFactorCode: String,
  twoFactorExpires: Date,
  resetPasswordCode: String,
  resetPasswordExpires: Date,
  resetRequestCount: { type: Number, default: 0 },
  resetRequestWindowStart: Date
});

module.exports = mongoose.model('Admin', adminSchema);