const express = require('express');
const path = require('path');
const { body } = require('express-validator');
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
adminRouter.post(
  '/add-product',
  isAuth,
  [
    body('title')
      .trim()
      .isString()
      .isLength({ min: 3 })
      .withMessage('Title must be at least 3 characters long.'),
    body('description')
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage('Description must be between 5 and 200 characters long.'),
    body('price').isFloat().withMessage('Price must be valid.'),
  ],
  postAddProduct
);

adminRouter.get('/edit-product/:productId', isAuth, getEditProduct);
adminRouter.post(
  '/edit-product',
  isAuth,
  [
    body('title')
      .trim()
      .isString()
      .isLength({ min: 3 })
      .withMessage('Title must be at least 3 characters long.'),
    body('description')
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage('Description must be between 5 and 200 characters long.'),
    body('price').isFloat().withMessage('Price must be valid.'),
  ],
  postEditProduct
);

adminRouter.delete('/product/:productId', isAuth, deleteProductById);

module.exports = adminRouter;
