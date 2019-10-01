let config;

switch (process.env.NODE_ENV) {
  case 'development':
    config = require('./config/webpack.dev.js');
    break;
  case 'production':
  default:
    config = require('./config/webpack.prod.js');
    break;
}

module.exports = config;
