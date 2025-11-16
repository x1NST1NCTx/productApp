const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'productuser',
  password: 'strong_password',
  database: 'productdb',
  connectionLimit: 5
});

module.exports = pool;
