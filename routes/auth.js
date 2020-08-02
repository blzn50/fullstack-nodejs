const express = require('express');
const { getLogin, postLogin, postLogout, getSignup, postSignup } = require('../controllers/auth');

const authRouter = express.Router();

authRouter.get('/login', getLogin);
authRouter.post('/login', postLogin);

authRouter.get('/signup', getSignup);
authRouter.post('/signup', postSignup);

authRouter.post('/logout', postLogout);

module.exports = authRouter;
