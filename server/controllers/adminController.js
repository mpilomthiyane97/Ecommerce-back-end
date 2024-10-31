const Admin = require('../models/Admin');
const ShopItem = require('../models/ShopItem');
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const { signup } = require('./customerController');


// admin signup
exports.createAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
          return res.status(400).json({ message: "Admin already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = new Admin({ email, password: hashedPassword });
      await admin.save();
      
      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
          expiresIn: '1h'
      });

      res.status(201).json({
          message: "Admin account created successfully",
          admin: {
              _id: admin._id,
              email: admin.email,
              password:admin.password,                       
          },
          token
      });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};

// Admin Signin
exports.signin = async (req, res) => {
  const { email, password } = req.body;
  try {
      const admin = await Admin.findOne({ email });
      if (!admin) {
          return res.status(404).json({ message: "Admin not found" });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
          return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
          expiresIn: '1h'
      });

      res.status(200).json({
          message: "Admin signed in successfully",
          admin: {
              _id: admin._id,
              email: admin.email,
              username: admin.username
          },
          token
      });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};
// Admin Signout
exports.signout = (req, res) => {
  res.json({ message: 'Admin signed out successfully' });
};

// Add Shop Item
exports.addItem = async (req, res) => {
  try {
    const { title, image, price, description, availableCount, category } = req.body;
    const newItem = new ShopItem({ title, image, price, description, availableCount, category });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Shop Item
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItem = await ShopItem.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Shop Item
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    await ShopItem.findByIdAndDelete(id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search Shop Items
exports.searchItems = async (req, res) => {
  try {
    const { title, category, minPrice, maxPrice } = req.query;
    const query = {};
    if (title) query.title = new RegExp(title, 'i');
    if (category) query.category = category;
    if (minPrice) query.price = { ...query.price, $gte: minPrice };
    if (maxPrice) query.price = { ...query.price, $lte: maxPrice };

    const items = await ShopItem.find(query);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('customer').populate('items.shopItem');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Customers
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};