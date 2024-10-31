const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
  items: [
    {
      shopItem: { type: Schema.Types.ObjectId, ref: 'ShopItem' },
      quantity: { type: Number, required: true }
    }
  ]
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
