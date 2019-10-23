const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { ROOT_PATH, APP_SRC_PATH, BUILD_PATH, NODE_ENV, isDev, STYLE_IDENT_NAME } = require('./constants');

module.exports = {
  mode: NODE_ENV,
  entry: {
    index: APP_SRC_PATH,
  },
  output: {
    path: BUILD_PATH,
    filename: isDev ? 'js/[name].js' : 'js/[name]_[contenthash:6].js',
    chunkFilename: isDev ? 'js/[name].js' : 'js/[name]_[contenthash:6].js',
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        include: [path.resolve(ROOT_PATH, 'src')],
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.(less|css)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
                modules: {
                  localIdentName: STYLE_IDENT_NAME,
                },
              },
            },
            'postcss-loader',
            'less-loader',
          ],
        }),
      },
      /* config.module.rule('images') */
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        use: [
          /* config.module.rule('images').use('url-loader') */
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: '65-90',
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75,
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
      /* config.module.rule('fonts') */
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: [
          /* config.module.rule('fonts').use('url-loader') */
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'fonts/[name]_[hash:8].[ext]',
                },
              },
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
    new ExtractTextPlugin('[name].css'),
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
