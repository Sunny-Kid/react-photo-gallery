const webpackMerge = require('webpack-merge');
const baseConfig = require('./webpack.base');

const config = {
  watchOptions: {
    ignored: /node_modules/,
  },
  devtool: 'cheap-module-eval-source-map',
};

module.exports = webpackMerge(config, baseConfig);
