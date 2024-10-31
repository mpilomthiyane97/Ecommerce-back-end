const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);