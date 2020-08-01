const express = require('express');
const { getLogin, postLogin } = require('../controllers/auth');

const authRouter = express.Router();

authRouter.get('/login', getLogin);
authRouter.post('/login', postLogin);

module.exports = authRouter;
