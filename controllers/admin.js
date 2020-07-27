const Product = require('../models/product');

exports.getAdminProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('admin/products', {
      pageTitle: 'All Products',
      path: '/admin/products',
      prods: products,
    });
  });
};

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', { pageTitle: 'Add Product', path: '/admin/add-product' });
};

exports.getEditProducts = (req, res, next) => {
  res.render('/admin/edit-product', { pageTitle: 'Edit Product', path: '/admin/edit-product' });
};

exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect('/');
};

exports.postEditProducts = (req, res, next) => {
  // res.render('/admin/edit-product', { pageTitle: 'Edit Product', path: '/admin/edit-product' });
  res.redirect('/');
};
