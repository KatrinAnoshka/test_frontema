import gulp from 'gulp';
import gulpIf from 'gulp-if';
import plumber from 'gulp-plumber';
import pug from 'gulp-pug';
import prettify from 'gulp-jsbeautifier';
import staticHash from 'gulp-static-hash';
import errorHandler from 'gulp-plumber-error-handler';
import replace from 'gulp-replace';
import path from 'path';

const isDevMode = process.argv.indexOf('--production') === -1;

const data = {
  jv0: 'javascript:void(0);',
  __DEV__: isDevMode,
};


gulp.task('templates', () => {
  return gulp.src(['src/pages/**/*.pug', '!src/pages/**/_*.pug'], { base: 'src/pages' })
    .pipe(plumber({ errorHandler: errorHandler(`Error in \'templates\' task`) }))
    .pipe(pug({ basedir: 'src', data }))
    .pipe(gulpIf(process.env.PRETTIFY !== 'false', prettify({
      braceStyle: 'expand',
      indentWithTabs: true,
      indentInnerHtml: true,
      preserveNewlines: true,
      endWithNewline: true,
      wrapLineLength: 120,
      maxPreserveNewlines: 50,
      wrapAttributesIndentSize: 1,
      unformatted: ['use']
    })))
    .pipe(gulpIf(!isDevMode, staticHash({
      asset: 'build',
      exts: ['js', 'css']
    })))
    .pipe(gulpIf(!isDevMode, gulp.dest('build')))
    .pipe(gulpIf(isDevMode, gulp.dest('dist')));
});

gulp.task('templates:build', gulp.series('templates', () => {
  return gulp.src(['build/**/*.html'], { base: 'build' })
    .pipe(replace('/assets/', function (match) {
      let level = 0;
      let pos = 0;
      let relative = '';
      const filePath = path.normalize(this.file.relative);

      while (true) {
        var foundPos = filePath.indexOf(path.sep, pos);
        if (foundPos == -1) break;
        level++;
        pos = foundPos + 1;
      }

      if (level > 0) {
        relative = '../'.repeat(level);
      }

      return `${relative}${match.slice(1)}`;
    }))
    .pipe(gulp.dest('build'));
}));

