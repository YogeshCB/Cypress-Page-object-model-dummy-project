import CompressionPlugin from 'compression-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import WebpackAssetsManifest from "webpack-assets-manifest";
import { publicPathProvider } from "./lib";
import { styleLoaders } from "./app.config";

export default {
  module: {
    rules: [{
      test: /(\.scss|\.css)$/,
      use: [{
        loader: MiniCssExtractPlugin.loader
      }, ...styleLoaders],
    }],
  },
  output: {
    chunkFilename: '[name].[contenthash].js.gz',
  },
  plugins: [
    new WebpackAssetsManifest({
      output: 'app-manifest.json',
      publicPath: publicPathProvider(true),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css.gz',
    }),
    new CompressionPlugin({
      filename: '[file]',
      algorithm: 'gzip',
      test: /(?:(?:\.js\.gz)|(?:\.css\.gz))$/,
      minRatio: 0.8,
    }),
    new CompressionPlugin({
      filename: '[file].gz',
      algorithm: 'gzip',
      test: /(?:\.js|\.css)$/,
      minRatio: 0.8,
      deleteOriginalAssets: true,
    })
  ],
};
