const express = require('express');
const morgan = require('morgan');
const path = require('path');

const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const app = express();

app.use(express.json());
app.use(morgan('tiny'));

app.use(shopRoutes);
app.use('/admin', adminRoutes);

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'views/404.html'));
});

app.listen(3000, () => 'Server running in port 3000');
