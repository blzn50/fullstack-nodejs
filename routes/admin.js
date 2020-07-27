const express = require('express');
const path = require('path');
const rootDir = require('../utils/path');

const adminRouter = express.Router();
const products = [];

adminRouter.get('/add-product', (req, res) => {
  res.render('add-product', { pageTitle: 'Add Product', path: '/admin/add-product' });
});

adminRouter.post('/add-product', (req, res) => {
  products.push({ title: req.body.title });
  res.redirect('/');
});

module.exports = { adminRouter, products };
