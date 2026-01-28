const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  course: { type: String, required: true },
  courseName: String,
  cccd: String,
  address: String,
  note: String,
  status: { type: String, default: 'pending' }, // pending: Chưa liên hệ, contacted: Đã liên hệ
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Registration', registrationSchema);