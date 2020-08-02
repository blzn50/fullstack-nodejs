const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById('5f2421696acee22778f3bb3b')
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        console.log('err: ', err);
        res.redirect('/');
      });
    })
    .catch((err) => console.log(err));
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    pageTitle: 'Sign Up',
    path: '/signup',
    isAuthenticated: false,
  });
};

exports.postSignup = (req, res, next) => {
  const { email } = req.body;
  const { password } = req.body;
  const { confirmPassword } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.redirect('/signup');
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const newUser = new User({ email, password: hashedPassword, carts: { items: [] } });
          return newUser.save();
        })
        .then((result) => {
          res.redirect('/login');
        });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.error(err);
    res.redirect('/');
  });
};
