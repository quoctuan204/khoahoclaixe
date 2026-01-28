const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  adminUsername: String,
  action: { type: String, required: true }, // CREATE, UPDATE, DELETE
  target: { type: String, required: true }, // Registration, Product, News, etc.
  targetId: String,
  details: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);