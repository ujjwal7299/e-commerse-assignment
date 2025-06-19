const mongoose = require('mongoose');
module.exports = mongoose.model('Cart', new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  items: [{ productId: mongoose.Schema.Types.ObjectId, qty: Number }]
}));