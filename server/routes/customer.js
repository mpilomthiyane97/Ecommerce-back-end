const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// Customer Authentication Routes
router.post('/signup', customerController.signup);
router.post('/signin', customerController.signin);
router.post('/signout', customerController.signout);

// Customer Shop Item Interaction Routes
router.get('/items', customerController.getItems);
router.get('/items/:id', customerController.getItem);
router.post('/cart', customerController.addToCart);
router.post('/checkout', customerController.checkout);

// Customer Profile Routes
router.get('/profile', customerController.getProfile);
router.put('/profile', customerController.updateProfile);
router.get('/orders', customerController.getOrders);
router.put('/cart/:itemId', customerController.updateCart);
router.delete('/cart/:itemId', customerController.removeFromCart);

module.exports = router;