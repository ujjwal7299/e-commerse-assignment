const mongoose = require('mongoose');
module.exports = mongoose.model('Product', new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  image: String
}));