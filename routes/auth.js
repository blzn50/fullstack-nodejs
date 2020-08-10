const express = require('express');
const { body } = require('express-validator');
const User = require('../models/user');
const {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getReset,
  postReset,
  getNewPassword,
  postNewPassword,
} = require('../controllers/auth');

const authRouter = express.Router();

authRouter.get('/login', getLogin);
authRouter.post(
  '/login',
  [body('email').isEmail(), body('password').isLength({ min: 5 })],
  postLogin
);

authRouter.get('/signup', getSignup);
authRouter.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please input a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject('Email already exists. Please pick a new one.');
          }
        });
      }),
    body('password')
      .isLength({ min: 5 })
      .withMessage('Password must be at least 5 characters long.'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password doesn't match");
      }
      return true;
    }),
  ],
  postSignup
);

authRouter.get('/reset', getReset);
authRouter.post('/reset', postReset);

authRouter.get('/reset/:token', getNewPassword);
authRouter.post('/new-password', postNewPassword);

authRouter.post('/logout', postLogout);

module.exports = authRouter;
