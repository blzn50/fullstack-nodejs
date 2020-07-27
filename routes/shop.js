const express = require('express');
const path = require('path');
const rootDir = require('../utils/path');
const { products } = require('./admin');
console.log('products: ', products);

const shopRouter = express.Router();

shopRouter.get('/', (req, res) => {
  res.render('shop', { pageTitle: 'Shop', path: '/', prods: products });
});

module.exports = shopRouter;
