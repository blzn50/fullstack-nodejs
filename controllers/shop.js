const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then((data) => {
      res.render('shop/index', {
        pageTitle: 'Shop',
        path: '/',
        prods: data.rows,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render('shop/product-list', {
        pageTitle: 'All Products',
        path: '/products',
        prods: products.rows,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProductDetail = (req, res, next) => {
  const id = req.params.productId;
  Product.getById(id).then((data) => {
    res.render('shop/product-detail', {
      pageTitle: data.rows[0].title,
      product: data.rows[0],
      path: '/products',
    });
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
  Product.getById(productId, (product) => {
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
