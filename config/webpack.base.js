/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const pkg = require('../package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { PROJECT_PATH, BUILD_PATH } = require('./constants');

const ROOT_PATH = path.resolve(__dirname, '../');
const APP_SRC_PATH = path.resolve(ROOT_PATH, './src/');
const NODE_ENV = process.env.NODE_ENV || 'development';
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  mode: NODE_ENV,
  entry: {
    index: APP_SRC_PATH,
  },
  output: {
    path: './dist',
    publicPath: '/static/',
    filename: isDev ? 'js/[name].js' : 'js/[name]_[contenthash:6].js',
    chunkFilename: isDev ? 'js/[name].js' : 'js/[name]_[contenthash:6].js',
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        oneOf: [
          {
            include: APP_SRC_PATH,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  cacheDirectory: false,
                },
              },
            ],
          },
        ],
      },
      {
        test: /\.(less|css)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              modules: {
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
                context: path.resolve(__dirname, 'src'),
              },
            },
          },
          'postcss-loader',
          'less-loader',
        ],
      },
      /* copy from vue-cli@3.7.0 start */
      /* config.module.rule('images') */
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        use: [
          /* config.module.rule('images').use('url-loader') */
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'img/[name]_[hash:8].[ext]',
                },
              },
            },
          },
        ],
      },
      /* config.module.rule('svg') */
      {
        test: /\.(svg)(\?.*)?$/,
        use: [
          /* config.module.rule('svg').use('file-loader') */
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name]_[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.mjs', '.ts', '.tsx', '.js', '.jsx', '.json'],
    symlinks: false,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(ROOT_PATH, './src/index.html'),
    }),
  ],
  optimization: {
    chunkIds: 'named',
    moduleIds: 'hashed',
    splitChunks: {
      chunks: 'initial',
      name: 'vendors',
    },
  },
};
