const express = require('express');
const {
  getIndex,
  getProducts,
  getCart,
  getOrders,
  getProductDetail,
  postToCart,
  removeItemFromCart,
  postCreateOrders,
} = require('../controllers/shop');

const shopRouter = express.Router();

shopRouter.get('/', getIndex);
shopRouter.get('/products', getProducts);
shopRouter.get('/products/:productId', getProductDetail);

shopRouter.get('/cart', getCart);
shopRouter.post('/cart', postToCart);
shopRouter.post('/cart-remove-item', removeItemFromCart);
shopRouter.post('/create-order', postCreateOrders);
// shopRouter.get('/orders', getOrders);

module.exports = shopRouter;
