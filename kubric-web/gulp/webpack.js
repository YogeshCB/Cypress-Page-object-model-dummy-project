import webpack from 'webpack';
import gutil from 'gulp-util';
import { getConfigFor } from "../webpack.config.babel";
import merge from 'webpack-merge';

export default (app, options = {}) => {
  const { env, config = {} } = options;
  let taskNum = 1;
  return done => {
    let webpackConfig = getConfigFor(app, env === 'production' ? 'production' : 'default');
    const mergedConfig = merge(webpackConfig, config);
    webpack(mergedConfig, (err, stats) => {
      const name = `[webpack:${config.watch ? 'watch:' : ''}${app}]`;
      if (err) {
        gutil.log(name, err);
        throw new gutil.PluginError("webpack", err);
      }
      gutil.log(name, stats.toString({
        colors: gutil.colors.supportsColor,
        hash: false,
        timings: false,
        chunks: false,
        chunkModules: false,
        modules: false,
        children: false,
        version: true,
        cached: false,
        cachedAssets: false,
        reasons: false,
        source: false,
        errorDetails: false,
        warnings: false
      }));
      (!config.watch || taskNum === 1) && done();
      taskNum++;
    });
  }
}