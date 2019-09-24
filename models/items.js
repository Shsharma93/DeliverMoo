const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
  type: { type: String, required: true, minlength: 3, maxlength: 50 },
  color: { type: String, required: true, minlength: 3, maxlength: 50 },
  size: { type: String, required: true, enum: ['S', 'M', 'L'] },
  stock: { type: Number, required: true }
});

const Item = mongoose.model('Items', itemSchema);

module.exports = Item;
