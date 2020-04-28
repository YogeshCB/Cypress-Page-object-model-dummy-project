import path from 'path';
import webpack from 'webpack';

const browserPath = path.resolve(__dirname, '../browser');
const isoPath = path.resolve(__dirname, '../isomorphic');
const nodeModulesPath = path.resolve(__dirname, '../node_modules');

export default {
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [browserPath, isoPath, nodeModulesPath],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              ["@babel/plugin-transform-react-jsx", { "pragma": "h" }],
              "@babel/plugin-syntax-dynamic-import",
              '@babel/plugin-proposal-function-bind',
              "@babel/plugin-transform-modules-commonjs",
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-proposal-class-properties'
            ],
            cacheDirectory: '/tmp/'
          }
        },
      }, {
        test: /\.jpg|\.png$/,
        use: 'url-loader?limit=100000&mimetype=image/png',
      }, {
        test: /\.svg/,
        use: 'svg-url-loader',
      },
      {
        test: /\.woff2$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 50000,
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      icons: path.resolve(browserPath, "icons"),
      fonts: path.resolve(browserPath, "fonts")
    },
    extensions: ['.scss', '.js', '.png', '.svg'],
    modules: ['node_modules', browserPath, isoPath],
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
  ]
};
