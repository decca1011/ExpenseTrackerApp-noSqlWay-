const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderid: {
    type: String,
    required: true,
    unique: true,
  },
  paymentid: {
    type: String,
  },
  status: {
    type: String,
    enum: ['PENDING', 'SUCCESS', 'FAILED'],
    default: 'PENDING',
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
