import path from 'path';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import { appTargets } from './lib';
import WebpackVisualizer from 'webpack-visualizer-plugin';
import WebpackNotifierPlugin from 'webpack-notifier';
import autoprefixer from "autoprefixer";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

const root = path.resolve(__dirname, '..');
export const dist = `${root}/dist/assets`;
export const browserPath = `${root}/browser`;
export const styleLoaders = [{
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
}];

export default {
  entry: {
    app: './browser/js/app',
  },
  output: {
    path: dist,
    filename: '[name].[contenthash].js',
    publicPath: '/assets/',
    globalObject: 'this'
  },
  plugins: [
    new WebpackNotifierPlugin({
      title: 'Kubric app',
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: appTargets,
    }),
    new WebpackVisualizer({
      filename: `stats/appstats.html`
    }),
    new BundleAnalyzerPlugin({
      reportFilename: `stats/appanalysis.html`,
      analyzerMode: "static",
      openAnalyzer: false
    }),
  ],
};
