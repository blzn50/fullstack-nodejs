const db = require('../utils/db');
const Cart = require('./cart');

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.query(
      'INSERT INTO products (title, description, "imageUrl", price) VALUES ($1,$2, $3, $4)',
      [this.title, this.description, this.imageUrl, this.price]
    );
  }

  static fetchAll() {
    return db.query('SELECT * FROM products', '');
  }

  static getById(id) {
    return db.query('SELECT * FROM products WHERE id = $1', [id]);
  }

  static deleteProduct(id) {}
};
