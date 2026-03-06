const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên vai trò là bắt buộc'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  permissions: [{
    type: String,
    required: true,
  }],
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);
