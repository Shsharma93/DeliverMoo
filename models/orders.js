const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  itemId: {
    type: [String],
    required: true
  },
  quantity: {
    type: [Number],
    required: true
  }
});

const Order = mongoose.model('Orders', orderSchema);

module.exports = Order;
