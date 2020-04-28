import { add, remove } from './babel-polyfill';
import babelify from './babelify';
import watch from '../watch';

const getTaskName = file => `babelify-${file}`;
const getWatchTaskName = file => `watch-babelify-${file}`;
const getDest = (root, file) => `${root}/${/\/\*\*\/\*\.js/.test(file) ? file.replace('/**/*.js', '') : ''}`;

export const addBabelifyTasks = (gulp, files, { srcRoot, buildRoot }) => {
  for (let file in files) {
    const conf = files[file];
    const taskName = getTaskName(file);
    const watchTaskName = getWatchTaskName(file);
    let watchSrc = '';
    let taskExecutor;
    if (typeof conf === 'string') {
      watchSrc = `${srcRoot}/${conf}`;
      taskExecutor = babelify(watchSrc, getDest(buildRoot, conf));
      gulp.task(taskName, taskExecutor);
    } else {
      const { root, fileName, from, addPolyfill, to = buildRoot } = conf;
      if (!addPolyfill) {
        watchSrc = `${srcRoot}/${from}`;
        taskExecutor = babelify(watchSrc, to);
        gulp.task(taskName, taskExecutor);
      } else {
        const addPolyfillTaskName = `add-${file}-polyfill`;
        const polyfilledTaskName = `babelify-polyfilled-${file}`;
        const srcFileRoot = `${srcRoot}/${root}`;
        gulp.task(addPolyfillTaskName, add(srcFileRoot, fileName));
        gulp.task(polyfilledTaskName, gulp.series(addPolyfillTaskName, babelify(`${srcFileRoot}/_${fileName}`, `${buildRoot}/${root}`, fileName)));
        taskExecutor = gulp.series(polyfilledTaskName, remove(srcFileRoot, fileName));
        gulp.task(taskName, taskExecutor);
        watchSrc = `${srcFileRoot}/${fileName}`;
      }
    }
    watchSrc.length > 0 && gulp.task(watchTaskName, watch(watchSrc, taskExecutor));
  }
};

export const getTaskNames = files => {
  const taskNames = [];
  for (let file in files) {
    taskNames.push(getTaskName(file));
  }
  return taskNames;
};

export const getWatchTaskNames = files => {
  const taskNames = [];
  for (let file in files) {
    taskNames.push(getWatchTaskName(file));
  }
  return taskNames;
};