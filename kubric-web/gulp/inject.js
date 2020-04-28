import gulp from 'gulp';
import replace from 'gulp-replace';
import fs from 'fs';

const getPlaceholderRegex = (tagName, placeholder) => new RegExp(`<${tagName}>{{${placeholder}}}</${tagName}>`);

export default (inputFile, tagName, placeholder, contentFile, dest) =>
  done => {
    gulp.src(inputFile)
      .pipe(replace(getPlaceholderRegex(tagName, placeholder), s => {
        const content = fs.readFileSync(contentFile, 'utf8');
        return `<${tagName}>${content}</${tagName}>`;
      }))
      .pipe(gulp.dest(dest))
      .on('end', () => done());
  };