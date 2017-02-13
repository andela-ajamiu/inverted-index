const gulp = require('gulp');
const gulpEslint = require('gulp-eslint');

gulp.task('eslint', () => gulp.src(['src/js/invertedIndex.js', 'spec/invertedIndexSpec.js'])
  .pipe(gulpEslint())
  .pipe(gulpEslint.format())
  .pipe(gulpEslint.failAfterError()));
