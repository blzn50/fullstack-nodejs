const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

mongoose.set('useCreateIndex', true);

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

productSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Product', productSchema);
