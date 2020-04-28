import DefinePlugin from 'webpack/lib/DefinePlugin';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';

export default {
  mode: 'production',
  module: {
    rules: [{
      test: /\.worker\.js$/,
      use: {
        loader: 'worker-loader',
        options: {
          name: 'worker.[hash].js.gz'
        }
      }
    }]
  },
  optimization: {
    minimizer: [new UglifyJSPlugin({
      parallel: true,
      uglifyOptions: {
        warnings: false,
      }
    })],
  },
  plugins: [
    new DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
      },
    }),
  ],
};
