const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  image: String,
  duration: String,
  vehicle: String,
  highlights: [String],
  oldPrice: String,
  price: String,
  description: String,
  theoryFee: String,
  examFee: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);