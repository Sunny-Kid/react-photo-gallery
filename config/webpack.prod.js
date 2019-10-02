const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpackMerge = require('webpack-merge');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const baseConfig = require('./webpack.base');

const config = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name]_[contenthash:6].css',
      allChunks: true,
    }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false, // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
};

module.exports = webpackMerge(config, baseConfig);
