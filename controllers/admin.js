const { validationResult } = require('express-validator');
const Product = require('../models/product');
const fileHelper = require('../utils/helpers');

exports.getAdminProducts = (req, res, next) => {
  Product.find({ userId: req.user._id }).then((products) => {
    res.render('admin/products', {
      pageTitle: 'All Products',
      path: '/admin/products',
      prods: products,
    });
  });
};

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (editMode !== 'true') {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId).then((product) => {
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      hasError: false,
      product,
      errorMessage: null,
      validationErrors: [],
    });
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title } = req.body;
  const image = req.file;
  const { description } = req.body;
  const { price } = req.body;

  if (!image) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {
        title,
        description,
        price,
      },
      errorMessage: 'Attached file is not an image.',
      validationErrors: [],
    });
  }

  const errors = validationResult(req);
  console.log('errors: ', errors.array());

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {
        title,
        description,
        price,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  const imageUrl = image.path;

  const product = new Product({ title, imageUrl, description, price, userId: req.user });

  product
    .save()
    .then(() => res.redirect('/admin/products'))
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const { productId } = req.body;
  const { title } = req.body;
  const image = req.file;
  const { description } = req.body;
  const { price } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      product: {
        id: productId,
        title,
        price,
        description,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.title = title;
      product.description = description;
      product.price = price;
      if (image) {
        fileHelper.deleteFile(product.imageUrl);
        product.imageUrl = image;
      }
      return product.save().then(() => {
        res.redirect('/admin/products');
      });
    })
    .catch((err) => console.log(err));
};

exports.deleteProductById = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findOne({ _id: prodId })
    .then((product) => {
      if (!product) {
        return next(new Error('Product not found.'));
      }
      fileHelper.deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: prodId, userId: req.user._id });
    })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch((err) => next(new Error(err)));
};
