// services/shopItemService.js
const ShopItem = require('../models/ShopItem');

exports.createItem = async (itemData) => {
  const newItem = new ShopItem(itemData);
  return await newItem.save();
};

exports.updateItem = async (id, updateData) => {
  return await ShopItem.findByIdAndUpdate(id, updateData, { new: true });
};

exports.deleteItem = async (id) => {
  return await ShopItem.findByIdAndDelete(id);
};

exports.getAllItems = async (filters = {}) => {
  return await ShopItem.find(filters);
};

exports.getItemById = async (id) => {
  return await ShopItem.findById(id);
};
