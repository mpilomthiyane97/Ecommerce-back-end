const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Admin Shop Item Management Routes
router.post('/createAdmin', adminController.createAdmin);
router.post('/signin', adminController.signin);
router.post('/signout', adminController.signout);
router.post('/items', adminController.addItem);
router.put('/items/:id', adminController.updateItem);
router.delete('/items/:id', adminController.deleteItem);
router.get('/items', adminController.searchItems);
router.get('/orders', adminController.getOrders);
router.get('/customers', adminController.getCustomers);
router.get('/test', (req, res) => {
    res.send('Admin test route is working!');
  });
  

module.exports = router;
