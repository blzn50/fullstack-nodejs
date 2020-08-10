const Product = require('../models/product');

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
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
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
      product,
    });
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title } = req.body;
  const { imageUrl } = req.body;
  const { description } = req.body;
  const { price } = req.body;

  const product = new Product({ title, imageUrl, description, price, userId: req.user });

  product
    .save()
    .then(() => res.redirect('/admin/products'))
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const { productId } = req.body;
  const { title } = req.body;
  const { imageUrl } = req.body;
  const { description } = req.body;
  const { price } = req.body;

  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.title = title;
      product.description = description;
      product.price = price;
      product.imageUrl = imageUrl;
      return product.save().then(() => {
        res.redirect('/admin/products');
      });
    })
    .catch((err) => console.log(err));
};

exports.deleteProductById = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.error(err);
    });
};
