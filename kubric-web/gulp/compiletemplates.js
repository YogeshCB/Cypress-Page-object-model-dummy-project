import gulp from 'gulp';
import clean from './clean';
import marko from './marko';
import inject from './inject';
import sass from './sass';


export const addTemplateTasks = ({ files = [], serverViewsRoot, stylesRoot, assetsRoot, buildRoot }) =>
  files.reduce((acc, { name, template, style, shouldCompileStyles, dependencies = [], taskPrefix = '' }) => {
    taskPrefix = taskPrefix.length > 0 ? `${taskPrefix}-` : '';
    template = template ? template : `${name}.marko`;
    const styleTemplate = style ? style : `${name}.scss`;
    const styleCss = style ? style : `${name}.css`;
    const tempDir = `${buildRoot}/__${name}_temp__`;
    const templateFile = `${serverViewsRoot}/${template}`;

    const tasks = [...dependencies];
    if (shouldCompileStyles) {
      tasks.push(sass(`${stylesRoot}/${styleTemplate}`, assetsRoot));
    }
    tasks.push(inject(templateFile, 'style', styleCss, `${assetsRoot}/${styleCss}`, tempDir), marko(`${tempDir}/${template}`, `${assetsRoot}/templates`), clean([tempDir]));
    const compileTask = gulp.series(tasks);
    gulp.task(`${taskPrefix}compile-${name}`, compileTask);
    acc[`${taskPrefix}${name}`] = compileTask;
    return acc;
  }, {});