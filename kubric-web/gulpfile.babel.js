const NODE_ENV = process.env.NODE_ENV || 'development';
import gulp from 'gulp';
import webpack from './gulp/webpack';
import watch from './gulp/watch';
import marko from './gulp/marko';
import { addBabelifyTasks, getTaskNames, getWatchTaskNames } from './gulp/babelify';
import { addTemplateTasks } from './gulp/compiletemplates';

const buildRoot = `${__dirname}/dist`;
const webpackRoot = `${__dirname}/webpack`;
const serverViewsRoot = `${__dirname}/server/views`;
const browserRoot = `${__dirname}/browser`;
const stylesRoot = `${browserRoot}/stylesheets`;
const assetsRoot = `${buildRoot}/assets`;
const templatesRoot = `${assetsRoot}/templates`;

const serverFiles = {
  browser: `browser/js/config/**/*.js`,
  server: `server/**/*.js`,
  isomorphic: `isomorphic/**/*.js`,
  bin: {
    root: 'bin',
    fileName: 'www',
    addPolyfill: true,
  },
  serverconf: {
    from: `serverconf/**/*.js`,
    to: `${__dirname}/config/`
  },
  appfile: `app.js`,
};

/**
 * Browserify with webpack
 */
const wpOptions = {
  env: NODE_ENV,
  webpackRoot,
};
const wpWatchOptions = {
  env: NODE_ENV,
  webpackRoot,
  config: {
    watch: true,
  }
};

/**
 * Babelifying server files
 */
addBabelifyTasks(gulp, serverFiles, {
  srcRoot: __dirname,
  buildRoot,
});
gulp.task('babelify', gulp.parallel(getTaskNames(serverFiles)));

gulp.task('webpack:app', webpack('app', wpOptions));
gulp.task('webpack:login', webpack('login', wpOptions));

gulp.task('webpack:watch:app', webpack('app', wpWatchOptions));
gulp.task('webpack:watch:login', webpack('login', wpWatchOptions));

/**
 * Copy fav icon to build assets dir
 */
gulp.task('copy-favicon', () => gulp.src('favicon.png').pipe(gulp.dest(assetsRoot)));

const templateTasks = addTemplateTasks({
  files: [{
    name: 'login'
  }, {
    name: 'login',
    taskPrefix: 'nwl',
  }, {
    name: 'login',
    dependencies: ['webpack:watch:login'],
    taskPrefix: 'wwl',
  }, {
    name: 'shell',
    template: 'index.marko',
    shouldCompileStyles: true,
  }],
  serverViewsRoot,
  assetsRoot,
  buildRoot,
  stylesRoot,
});

/**
 * Compile templates other than login.marko
 */
const compileMarkoTemplates = marko([`${serverViewsRoot}/**/*.marko`, `!${serverViewsRoot}/*.marko`], templatesRoot);
gulp.task('compile-marko-templates', compileMarkoTemplates);

const loginStyles = `${assetsRoot}/login.css`;

const prodTasksExecutor = gulp.series('babelify', 'webpack:login', 'copy-favicon', 'compile-login', 'compile-shell', 'compile-marko-templates', 'webpack:app');
gulp.task('production', prodTasksExecutor);
gulp.task('release', prodTasksExecutor);

/**
 * local release
 * Release build with watch enabled for debugging server and marko changes
 */
const loginTemplate = `${serverViewsRoot}/login.marko`;
gulp.task('watch-compile-login', watch([loginStyles, loginTemplate], templateTasks['nwl-login']));
gulp.task('watch-compile-shell', watch([`${serverViewsRoot}/index.marko`, `${stylesRoot}/**/*.scss`], templateTasks['shell']));
gulp.task('watch-marko-templates', watch([`${serverViewsRoot}/**/*.marko`, `!${serverViewsRoot}/login.marko`], compileMarkoTemplates));

gulp.task('default', gulp.series('babelify', 'compile-marko-templates', 'compile-shell', 'copy-favicon', 'wwl-compile-login',
  gulp.parallel(...getWatchTaskNames(serverFiles), 'watch-compile-login', 'watch-compile-shell', 'webpack:watch:app', 'watch-marko-templates')
));