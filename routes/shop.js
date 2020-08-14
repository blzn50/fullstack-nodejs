const express = require('express');
const {
  getIndex,
  getProducts,
  getCart,
  getOrders,
  getProductDetail,
  postToCart,
  removeItemFromCart,
  getInvoice,
  getCheckout,
} = require('../controllers/shop');
const isAuth = require('../middlewares/is-auth');

const shopRouter = express.Router();

shopRouter.get('/', getIndex);
shopRouter.get('/products', getProducts);
shopRouter.get('/products/:productId', getProductDetail);

shopRouter.get('/cart', isAuth, getCart);
shopRouter.post('/cart', isAuth, postToCart);
shopRouter.post('/cart-remove-item', isAuth, removeItemFromCart);

// shopRouter.get('/checkout', isAuth, getCheckout);
shopRouter.get('/orders', isAuth, getOrders);
shopRouter.get('/orders/:orderId', isAuth, getInvoice);

module.exports = shopRouter;
