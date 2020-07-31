const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render('shop/index', {
        pageTitle: 'Shop',
        path: '/',
        prods: products,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render('shop/product-list', {
        pageTitle: 'All Products',
        path: '/products',
        prods: products,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProductDetail = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .then((product) => {
      res.render('shop/product-detail', {
        pageTitle: product.title,
        product: product,
        path: '/products',
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (let product of products) {
        const cartProductData = cart.products.find((prod) => prod.id === product.id);
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render('shop/cart', { pageTitle: 'Your Cart', path: '/cart', products: cartProducts });
    });
  });
};

exports.postToCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect('/cart');
};

exports.removeItemFromCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.getById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', { pageTitle: 'Your Cart', path: '/orders' });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', { pageTitle: 'Checkout Page', path: '/checkout' });
};
