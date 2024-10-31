const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  items: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopItem', required: true },
      quantity: { type: Number, required: true }
    }
  ],
  total: { type: Number, required: true }
});

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order