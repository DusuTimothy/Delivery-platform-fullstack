require('dotenv').config();

const fs = require('fs');
const path = require('path');

const sslCaPath = process.env.DB_SSL_CA_PATH;
const dialectOptions = sslCaPath
  ? {
      ssl: {
        require: true,
        rejectUnauthorized: true,
        ca: fs.readFileSync(path.resolve(__dirname, '..', sslCaPath), 'utf8')
      }
    }
  : undefined;

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions,
    logging: false
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME + '_test',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions,
    logging: false
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions,
    logging: false
  }
};
