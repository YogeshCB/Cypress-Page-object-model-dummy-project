import gulp from 'gulp';

export default (src, task) => () => gulp.watch(src, task);

