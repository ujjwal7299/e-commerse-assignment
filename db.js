const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://test-ujjwal:Ujjwal12345@cluster0.hhnkp.mongodb.net/test')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));
module.exports = mongoose;
