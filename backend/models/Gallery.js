const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: String,
  image: { type: String, required: true },
  type: { type: String, default: 'Hoạt động' }, // 'Khóa học', 'Tin tức', 'Hoạt động'
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Gallery', gallerySchema);