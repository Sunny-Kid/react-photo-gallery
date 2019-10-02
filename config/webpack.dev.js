const path = require('path');
const webpackMerge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const { ROOT_PATH } = require('./constants');

const config = {
  watchOptions: {
    ignored: /node_modules/,
  },
  devServer: {
    contentBase: path.join(ROOT_PATH, 'dist'),
    compress: true,
    watchContentBase: true,
    port: 8080,
    hot: true,
  },
  devtool: 'cheap-module-eval-source-map',
};

module.exports = webpackMerge(config, baseConfig);
