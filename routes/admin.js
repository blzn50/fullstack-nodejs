const express = require('express');
const path = require('path');
const rootDir = require('../utils/path');

const adminRouter = express.Router();

adminRouter.get('/add-product', (req, res) => {
  res.sendFile(path.join(rootDir, 'views/add-product.html'));
});

adminRouter.post('/add-product', (req, res) => {
  console.log('req: ', req.body);
  res.redirect('/');
});

module.exports = adminRouter;
