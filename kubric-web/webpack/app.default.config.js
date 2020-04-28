import WebpackAssetsManifest from "webpack-assets-manifest";
import { publicPathProvider } from "./lib";
import { styleLoaders } from "./app.config";

export default {
  module: {
    rules: [{
      test: /(\.scss|\.css)$/,
      use: [{
        loader: "style-loader"
      }, ...styleLoaders],
    },
    ],
  },
  output: {
    chunkFilename: '[name].[contenthash].js',
  },
  plugins: [
    new WebpackAssetsManifest({
      output: 'app-manifest.json',
      publicPath: publicPathProvider(false),
    })
  ],
};
