import webpack from 'webpack';

export default {
  mode: "none",
  devtool: false,
  module: {
    rules: [{
      test: /\.worker\.js$/,
      use: {
        loader: 'worker-loader',
        options: {
          name: 'worker.[hash].js'
        }
      }
    }],
  },
  plugins: [
    new webpack.EvalSourceMapDevToolPlugin({
      test: /\.(js|css)($|\?)/i,
      exclude: /^vendors~/
    })
  ]
}
