const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const sinon = require('sinon');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { expect } = require('chai');

const customerController = require('../controllers/customerController');
const Customer = require('../models/Customer');
const ShopItem = require('../models/ShopItem');
const Cart = require('../models/Cart');

// Setup Express app
const app = express();
app.use(bodyParser.json());
app.post('/signup', customerController.signup);
app.post('/signin', customerController.signin);
app.post('/signout', customerController.signout);
app.get('/items', customerController.getItems);
app.get('/item/:id', customerController.getItem);
app.post('/cart', customerController.addToCart);

describe('CustomerController', () => {
  let customerToken;
  let customerId;
  let itemId;
  let cartId;

  // Customer signup
  it('should sign up a new customer', async () => {
    const res = await request(app)
      .post('/signup')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('email', 'test@example.com');

    customerId = res.body._id;
  });

  // Customer signin
  it('should sign in a customer', async () => {
    const res = await request(app)
      .post('/signin')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');

    customerToken = res.body.token;
  });

  // Get all shop items
  it('should get all shop items', async () => {
    const res = await request(app)
      .get('/items')
      .set('Authorization', `Bearer ${customerToken}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  // Add to cart
  it('should add an item to the cart', async () => {
    const item = new ShopItem({ name: 'Test Item', price: 10, availableCount: 100 });
    await item.save();
    itemId = item._id;

    const res = await request(app)
      .post('/cart')
      .send({
        customerId,
        itemId,
        quantity: 1,
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('items');

    cartId = res.body._id;
  });

  // Checkout
  it('should checkout the cart', async () => {
    const res = await request(app)
      .post('/checkout')
      .send({
        customerId,
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('total');
  });

  // Get customer profile
  it('should get the customer profile', async () => {
    const res = await request(app)
      .get('/profile')
      .send({
        customerId,
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', customerId);
  });

  // Update customer profile
  it('should update the customer profile', async () => {
    const res = await request(app)
      .put('/profile')
      .send({
        customerId,
        name: 'Updated Name',
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', 'Updated Name');
  });

  // Get customer orders
  it('should get the customer orders', async () => {
    const res = await request(app)
      .get('/orders')
      .send({
        customerId,
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  // Update cart
  it('should update the cart', async () => {
    const res = await request(app)
      .put(`/cart/${itemId}`)
      .send({
        customerId,
        itemId,
        quantity: 2,
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('items');
  });

  // Remove from cart
  it('should remove an item from the cart', async () => {
    const res = await request(app)
      .delete(`/cart/${itemId}`)
      .send({
        customerId,
        itemId,
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('items');
  });

  // Customer signout
  it('should sign out a customer', async () => {
    const res = await request(app)
      .post('/signout');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Customer signed out successfully');
  });
});
