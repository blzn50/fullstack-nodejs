const express = require('express');
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
authRouter.post('/login', postLogin);

authRouter.get('/signup', getSignup);
authRouter.post('/signup', postSignup);

authRouter.get('/reset', getReset);
authRouter.post('/reset', postReset);

authRouter.get('/reset/:token', getNewPassword);
authRouter.post('/new-password', postNewPassword);

authRouter.post('/logout', postLogout);

module.exports = authRouter;
