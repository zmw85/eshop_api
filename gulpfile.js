const gulp = require('gulp');
const eslint = require('gulp-eslint');
const nodemon = require('gulp-nodemon');

gulp.task('lint', () => {
  return gulp
    .src(['**/*.js', '!node_modules/**', '!test/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('start', () => {
  nodemon({
    script: 'server/server.js'
    , ext: 'js'
    , ignore: ['test/**', 'gulpfile.js']
    , env: { 'NODE_ENV': 'dev' }
  });
});

gulp.task('default', ['start']);