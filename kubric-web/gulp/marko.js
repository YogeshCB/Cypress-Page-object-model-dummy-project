import gulp from 'gulp';
import compiler from 'marko/compiler';
import es from 'event-stream';
import gutil from 'gulp-util';

const compileMarko = ({ renameTo } = {}) => es.map((file, cb) => {
  // empty file
  if (file.isNull()) {
    return cb(null, file);
  }

  // stream
  if (file.isStream()) {
    return cb(new Error('Streaming not supported'));
  }

  let data;
  let src = file.contents.toString('utf8');
  let path = file.path;
  let dest = gutil.replaceExtension(path, '.marko.js');
  if (renameTo) {
    dest = dest.replace(/\/(?:[^./]+)\.marko\.js$/, `/${renameTo}`);
  }
  try {
    data = compiler.compile(src, path);
  } catch (err) {
    return cb(err);
  }

  file.contents = new Buffer(data);
  file.path = dest;

  cb(null, file);

});

export default (src, dest, options) => () => {
  const stream = gulp.src(src)
    .pipe(compileMarko(options))
    .pipe(gulp.dest(dest));
  stream.on('error', err => {
    gutil.log(err.message);
    stream.end();
  });
  return stream;
}
