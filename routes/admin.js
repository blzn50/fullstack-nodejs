const express = require('express');
const path = require('path');
const {
  getAddProduct,
  postAddProduct,
  getAdminProducts,
  getEditProduct,
} = require('../controllers/admin');

const adminRouter = express.Router();

adminRouter.get('/products', getAdminProducts);
adminRouter.get('/add-product', getAddProduct);

adminRouter.get('/edit-product/:productId', getEditProduct);

adminRouter.post('/add-product', postAddProduct);

module.exports = adminRouter;
