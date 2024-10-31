const Customer = require('../models/Customer');
const ShopItem = require('../models/ShopItem');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Customer Signup
exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new customer
    const newCustomer = new Customer({ email, password: hashedPassword });
    await newCustomer.save();

    // Generate a JWT token
    const token = jwt.sign({ id: newCustomer._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Send response
    res.status(201).json({
      message: "customer account created successfully",
      newCustomer: {
        _id: newCustomer._id,
        email: newCustomer.email,
      },
      token
    });
}catch (err) {
  console.error('Error:', err.message); // Log the error for debugging
  res.status(500).json({ error: err.message });
}
}; 


// Customer Signin
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer = await Customer.findOne({ email });
    if (!customer) return res.status(400).json({ message: 'Customer not found' });

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Signin successful', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Customer Signout
exports.signout = (req, res) => {
  res.json({ message: 'Customer signed out successfully' });
};

// Get All Shop Items
exports.getItems = async (req, res) => {
  try {
    const { category, minPrice, maxPrice } = req.query;
    const query = {};
    if (category) query.category = category;
    if (minPrice) query.price = { ...query.price, $gte: minPrice };
    if (maxPrice) query.price = { ...query.price, $lte: maxPrice };

    const items = await ShopItem.find(query);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single Shop Item
exports.getItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await ShopItem.findById(id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add to Cart
exports.addToCart = async (req, res) => {
  try {
    const { customerId, itemId, quantity } = req.body;
    const customer = await Customer.findById(customerId);
    const item = await ShopItem.findById(itemId);

    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.availableCount < quantity) return res.status(400).json({ message: 'Not enough items in stock' });

    let cart = await Cart.findOne({ customer: customerId });
    if (!cart) {
      cart = new Cart({ customer: customerId, items: [] });
    }

    // Initialize items if it's undefined
    if (!cart.items) {
      cart.items = [];
    }

    const cartItemIndex = cart.items.findIndex(i => i.shopItem.equals(itemId));
    if (cartItemIndex > -1) {
      cart.items[cartItemIndex].quantity += quantity;
    } else {
      cart.items.push({ shopItem: itemId, quantity });
    }

    item.availableCount -= quantity;
    await item.save();
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Checkout
exports.checkout = async (req, res) => {
  try {
    const { customerId } = req.body;
    const customer = await Customer.findById(customerId).populate('cart');
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    const cart = await Cart.findOne({ customer: customerId }).populate('items.shopItem');
    if (!cart) return res.status(400).json({ message: 'Cart is empty' });

    const orderItems = cart.items.map(item => ({
      shopItem: item.shopItem._id,
      quantity: item.quantity
    }));

    const total = cart.items.reduce((sum, item) => sum + item.shopItem.price * item.quantity, 0);

    const newOrder = new Order({ customer: customerId, items: orderItems, total });
    await newOrder.save();

    cart.items = [];
    await cart.save();

    res.json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Customer Profile
exports.getProfile = async (req, res) => {
  try {
    const { customerId } = req.body;
    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Customer Profile
exports.updateProfile = async (req, res) => {
  try {
    const { customerId } = req.body;
    const updatedCustomer = await Customer.findByIdAndUpdate(customerId, req.body, { new: true });
    if (!updatedCustomer) return res.status(404).json({ message: 'Customer not found' });
    res.json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Customer Orders
exports.getOrders = async (req, res) => {
  try {
    const { customerId } = req.body;
    const orders = await Order.find({ customer: customerId }).populate('items.shopItem');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Cart
exports.updateCart = async (req, res) => {
  try {
    const { customerId, itemId, quantity } = req.body;
    const cart = await Cart.findOne({ customer: customerId });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const cartItemIndex = cart.items.findIndex(i => i.shopItem.equals(itemId));
    if (cartItemIndex > -1) {
      cart.items[cartItemIndex].quantity = quantity;
    } else {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove from Cart
exports.removeFromCart = async (req, res) => {
  try {
    const { customerId, itemId } = req.body;
    const cart = await Cart.findOne({ customer: customerId });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(i => !i.shopItem.equals(itemId));

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
