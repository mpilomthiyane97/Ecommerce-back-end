const mongoose = require('mongoose');

const ShopItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  description: { type: String },
  availableCount: { type: Number, required: true },
  
});

const ShopItem = mongoose.model('ShopItem', ShopItemSchema);
module.exports = ShopItem;