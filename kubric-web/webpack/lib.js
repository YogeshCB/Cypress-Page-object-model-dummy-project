const targets = ['app', 'tasks', 'template', 'audience', 'content', 'campaign', 'storyboard', 'assets', 'profile', 'vendor'];

export const appTargets =
  targets.reduce((acc, target) => ([
    ...acc,
    `dist/assets/${target}*.js`,
    `dist/assets/${target}*.js.gz`,
    `dist/assets/${target}*.css.gz`,
  ]), []);

export const loginTargets = [
  'dist/assets/login*.js',
  'dist/assets/login*.js.gz',
  'dist/assets/login*.js.map',
  'dist/assets/login*.css',
  'dist/assets/login*.css.gz',
  'dist/assets/login*.css.map',
  'dist/assets/login-manifest.json',
];

export const publicPathProvider = addGz => val => `/assets/${/\.map$/.test(val) ? val : `${val}${addGz ? ".gz" : ""}`}`;
