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
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  console.log('editMode: ', editMode);
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.getById(prodId, (product) => {
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product,
    });
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title } = req.body;
  const { imageUrl } = req.body;
  const { description } = req.body;
  const { price } = req.body;

  const product = new Product(null, title, imageUrl, description, price);

  product
    .save()
    .then(() => res.redirect('/'))
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const { productId } = req.body;
  const { title } = req.body;
  const { imageUrl } = req.body;
  const { description } = req.body;
  const { price } = req.body;

  const updatedProduct = new Product(productId, title, imageUrl, description, price);
  updatedProduct.save();
  res.redirect('/admin/products');
};

exports.deleteProductById = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteProduct(prodId);
  res.redirect('/admin/products');
};
