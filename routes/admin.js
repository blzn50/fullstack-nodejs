const express = require('express');
const path = require('path');
const { getAddProduct, postAddProduct, getAdminProducts } = require('../controllers/admin');

const adminRouter = express.Router();

adminRouter.get('/add-product', getAddProduct);
adminRouter.get('/products', getAdminProducts);

adminRouter.get('/edit-product');

adminRouter.get('/add-product', getAddProduct);

adminRouter.post('/add-product', postAddProduct);
adminRouter.post('/edit-product');

module.exports = adminRouter;
