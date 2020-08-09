const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
const User = require('../models/user');

sgMail.setApiKey(process.env.SENDGRID_API);

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const { email } = req.body;
  const { password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Invalid email/password');
        return res.redirect('/login');
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log('err: ', err);
              res.redirect('/');
            });
          }
          req.flash('error', 'Invalid email/password');
          res.redirect('/login');
        })
        .catch((err) => {
          res.redirect('/login');
          console.log(err);
        });
    })
    .catch((err) => console.log(err));
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    pageTitle: 'Sign Up',
    path: '/signup',
    errorMessage: message,
  });
};

exports.postSignup = (req, res, next) => {
  const { email } = req.body;
  const { password } = req.body;
  const { confirmPassword } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        req.flash('error', 'Email already exists. Please pick a new one.');
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
          const msg = {
            to: email,
            from: 'no-reply@e-shop.com',
            subject: 'Sign Up success',
            // text: 'and easy to do anywhere, even with Node.js',
            html: '<h1>Welcome!</h1> You have successfully signed up to the e-shop.',
          };
          return sgMail.send(msg);
        })
        .catch((err) => {
          console.log(err);
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

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash('error', 'Cannot find account with that email!');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect('/');
        sgMail.send({
          to: req.body.email,
          from: 'no-reply@e-shop.com',
          subject: 'Reset Password',
          html: `<p>You have requested to reset password to your email.</p> 
            <p>If this is requested by you then please follow this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password otherwise ignore this email.</p>`,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
