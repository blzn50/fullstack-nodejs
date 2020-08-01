const express = require('express');
const {
  getIndex,
  getProducts,
  getCart,
  getCheckout,
  getOrders,
  getProductDetail,
  postToCart,
  removeItemFromCart,
} = require('../controllers/shop');

const shopRouter = express.Router();

shopRouter.get('/', getIndex);
shopRouter.get('/products', getProducts);
shopRouter.get('/products/:productId', getProductDetail);

shopRouter.get('/cart', getCart);
shopRouter.post('/cart', postToCart);
shopRouter.post('/cart-remove-item', removeItemFromCart);
// shopRouter.get('/orders', getOrders);
// shopRouter.get('/checkout', getCheckout);

module.exports = shopRouter;
