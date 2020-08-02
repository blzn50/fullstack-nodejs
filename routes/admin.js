const express = require('express');
const path = require('path');
const {
  getAddProduct,
  postAddProduct,
  getAdminProducts,
  getEditProduct,
  postEditProduct,
  deleteProductById,
} = require('../controllers/admin');
const isAuth = require('../middlewares/is-auth');

const adminRouter = express.Router();

adminRouter.get('/products', isAuth, getAdminProducts);

adminRouter.get('/add-product', isAuth, getAddProduct);
adminRouter.post('/add-product', isAuth, postAddProduct);

adminRouter.get('/edit-product/:productId', isAuth, getEditProduct);
adminRouter.post('/edit-product', isAuth, postEditProduct);

adminRouter.post('/delete-product', isAuth, deleteProductById);

module.exports = adminRouter;
