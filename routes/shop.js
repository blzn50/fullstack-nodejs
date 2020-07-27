const express = require('express');
const {
  getIndex,
  getProducts,
  getCart,
  getCheckout,
  getOrders,
  getProductDetail,
  postToCart,
} = require('../controllers/shop');

const shopRouter = express.Router();

shopRouter.get('/', getIndex);
shopRouter.get('/products', getProducts);
shopRouter.get('/products/:productId', getProductDetail);

shopRouter.get('/cart', getCart);
shopRouter.post('/cart', postToCart);
shopRouter.get('/orders', getOrders);
shopRouter.get('/checkout', getCheckout);

module.exports = shopRouter;
