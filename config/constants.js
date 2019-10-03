const path = require('path');

const ROOT_PATH = path.resolve(__dirname, '../');
const APP_SRC_PATH = path.resolve(ROOT_PATH, 'src/index');
const BUILD_PATH = path.resolve(ROOT_PATH, 'dist');
const NODE_ENV = process.env.NODE_ENV || 'development';
const isDev = NODE_ENV === 'development';
const STYLE_IDENT_NAME = isDev
  ? '[path]___[name]__[local]___[hash:base64:5]'
  : '[local]___[hash:base64:12]';

module.exports = {
  ROOT_PATH,
  APP_SRC_PATH,
  NODE_ENV,
  BUILD_PATH,
  isDev,
  STYLE_IDENT_NAME,
};
