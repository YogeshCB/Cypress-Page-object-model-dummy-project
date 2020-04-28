// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org/configurations/custom-webpack-config

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.

const webpack = require("webpack");
const autoprefixer = require("autoprefixer");

const path = require('path');
const browserPath = path.resolve(__dirname, '../browser');
const isoPath = path.resolve(__dirname, '../isomorphic');

module.exports = {
  name: 'client',
  target: 'web',
  resolve: {
    extensions: ['.scss', '.js', '.png', '.svg'],
    alias: {
      'react': 'preact-compat',
      'react-dom': 'preact-compat'
    },
    modules: ['node_modules', browserPath, isoPath],
  },
  devtool: false,
  plugins: [
    new webpack.EvalSourceMapDevToolPlugin({
      test: /\.(js|css)($|\?)/i,
      exclude: /^vendors~/
    })
  ],
  module: {
    rules: [{
      include: [browserPath, isoPath],
      test: /\.js?$/,
      use: 'babel-loader',
    }, {
      test: /\.jpg|\.png$/,
      use: 'url-loader?limit=100000&mimetype=image/png',
    }, {
      test: /\.scss$/,
      use: [{
        loader: "style-loader"
      }, {
        loader: 'css-loader',
        options: {
          sourceMap: true,
          modules: true,
          importLoaders: 1,
          localIdentName: "[name]__[local]___[hash:base64:5]"
        }
      }, {
        loader: 'postcss-loader',
        options: {
          plugins: () => [autoprefixer()]
        }
      }, {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
          includePaths: [browserPath]
        }
      }],
    }, {
      test: /\.svg/,
      use: 'svg-url-loader',
    }, {
      test: /\.woff2$/,
      use: 'file-loader',
      include: browserPath
    }],
  },
};
