import gulp from 'gulp';
import sass from 'gulp-sass';
import base64 from 'gulp-base64';
import plumber from 'gulp-plumber';


export default (src, dest) => () =>
  gulp.src(src)
    .pipe(plumber())
    .pipe(sass({
      includePaths: ['node_modules/'],
      outputStyle: 'compressed',
      importer(url) {
        //Replace URLs staring with "~" with the non "~" version. Node SASS is not capable of resolving "~ to node_modules
        //like webpack
        return {
          file: url.replace(/^~(.*?)$/, '$1'),
        };
      }
    }))
    .pipe(base64({
      baseDir: 'browser/stylesheets/icons',
      extensions: ['svg', 'png'],
      maxImageSize: 20 * 1024,
    }))
    .pipe(gulp.dest(dest));
