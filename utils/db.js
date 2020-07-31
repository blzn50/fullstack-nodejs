const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'store',
  password: 'admin',
  port: 5432,
});

module.exports = {
  query: (text, params) => {
    return pool.query(text, params);
  },
  getClient: () => {
    return pool.connect(err, client, done);
  },
};
