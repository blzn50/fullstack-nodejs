const express = require('express');
const path = require('path');
const rootDir = require('../utils/path');

const shopRouter = express.Router();

shopRouter.get('/', (req, res) => {
  res.sendFile(path.join(rootDir, 'views/shop.html'));
});

module.exports = shopRouter;
