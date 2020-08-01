const express = require('express');
const { getLogin } = require('../controllers/auth');

const authRouter = express.Router();

authRouter.get('/login', getLogin);

module.exports = authRouter;
