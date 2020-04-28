import path from 'path';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import WebpackAssetsManifest from 'webpack-assets-manifest';
import { loginTargets, publicPathProvider } from './lib';
import WebpackVisualizer from 'webpack-visualizer-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import WebpackNotifierPlugin from 'webpack-notifier';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const root = path.resolve(__dirname, '..');
const dist = `${root}/dist/assets`;

export default {
  entry: {
    login: './browser/js/login/index.js',
  },
  module: {
    rules: [{
      test: /(\.scss|\.css)$/,
      include: /browser/,
      use: [{
        loader: MiniCssExtractPlugin.loader,
      }, 'css-loader', 'sass-loader']
    }]
  },
  output: {
    path: dist,
    filename: 'login.[hash].js',
  },
  plugins: [
    new WebpackNotifierPlugin({
      title: 'Kubric login',
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: loginTargets
    }),
    new WebpackAssetsManifest({
      output: 'login-manifest.json',
      publicPath: publicPathProvider(true),
    }),
    new MiniCssExtractPlugin({
      filename: 'login.css'
    }),
    new WebpackVisualizer({
      filename: `stats/loginstats.html`
    }),
    new BundleAnalyzerPlugin({
      reportFilename: `stats/loginanalysis.html`,
      analyzerMode: 'static',
      openAnalyzer: false
    }),
    new CompressionPlugin({
      filename: '[path].gz',
      algorithm: 'gzip',
      test: /\.js$/,
      minRatio: 0.8,
      deleteOriginalAssets: true,
    }),
  ],
};
