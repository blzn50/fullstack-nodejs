const fs = require('fs');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const PDFDocument = require('pdfkit');
const Product = require('../models/product');
const Order = require('../models/order');

const ITEMS_PER_PAGE = 2;

exports.getIndex = (req, res, next) => {
  let page = +req.query.page || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then((docNums) => {
      totalItems = docNums;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render('shop/index', {
        pageTitle: 'Shop',
        path: '/',
        prods: products,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getProducts = (req, res, next) => {
  let page = +req.query.page || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then((docNums) => {
      totalItems = docNums;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render('shop/product-list', {
        pageTitle: 'All Products',
        path: '/products',
        prods: products,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      next(err);
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
      next(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then((user) => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postToCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect('/cart');
    })
    .catch((err) => {
      next(err);
    });
};

exports.removeItemFromCart = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then((user) => {
      res.redirect('/cart');
    })
    .catch((err) => next(err));
};

exports.getCheckout = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then((user) => {
      const products = user.cart.items;
      let totalSum = 0;
      products.forEach((p) => {
        totalSum += p.quantity * p.productId.price;
      });
      res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout Page',
        products,
        totalSum,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCreateOrders = (req, res, next) => {
  const token = req.body.stripeToken;
  console.log('token: ', token);
  let totalSum = 0;

  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((i) => {
        totalSum += i.quantity * i.productId.price;
        return {
          quantity: i.quantity,
          product: { ...i.productId._doc },
        };
      });

      const order = new Order({
        user: {
          userId: req.user,
          email: req.user.email,
        },
        products,
      });
      return order.save();
    })
    .then((result) => {
      // const charge = stripe.charges.create({
      //   amount: totalSum,
      //   currency: 'usd',
      //   description: 'Charge for products bought',
      //   source: token,
      //   metadata: { order_id: result._id.toString() },
      // });
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch((err) => {
      next(err);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then((orders) => {
      res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders',
        orders: orders,
      });
    })
    .catch((err) => next(err));
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error('No order found.'));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized'));
      }
      const invoiceName = 'invoice-' + orderId + '.pdf';
      const invoicePath = path.join('data', 'invoices', invoiceName);

      const pdfDoc = new PDFDocument();

      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');

      pdfDoc.fontSize(26).text('Invoice', {
        underline: true,
        align: 'center',
      });

      pdfDoc.text('-----------------------------------------', { align: 'center' });
      let totalPrice = 0;
      order.products.forEach((prod) => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(14)
          .text(prod.product.title + ' - ' + prod.quantity + ' x $ ' + prod.product.price);
      });
      pdfDoc.text('----------------------');
      pdfDoc.fontSize(18).text('Total Price: $' + totalPrice);
      pdfDoc.end();
      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return next(err);
      //   }
      //   res.setHeader('Content-Type', 'application/pdf');
      //   res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
      //   res.send(data);
      // });
      // const file = fs.createReadStream(invoicePath);

      // file.pipe(res);
    })
    .catch((err) => next(err));
};
