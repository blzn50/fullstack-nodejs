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
  const { title } = req.body;
  const { imageUrl } = req.body;
  const { description } = req.body;
  const { price } = req.body;

  const product = new Product(title, imageUrl, description, price);

  product.save();
  res.redirect('/');
};

exports.postEditProducts = (req, res, next) => {
  // res.render('/admin/edit-product', { pageTitle: 'Edit Product', path: '/admin/edit-product' });
  res.redirect('/');
};
