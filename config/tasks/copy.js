import gulp from 'gulp';
import changed from 'gulp-changed';
import filter from 'gulp-filter';
import gulpIf from 'gulp-if';

const { INCLUDE_ROBOTS } = process.env;
const isDevMode = process.argv.indexOf('--production') === -1;

gulp.task('copy', () => (
  gulp.src(isDevMode ? 'src/resources/other/**/*' : 'src/resources/{images,fonts,icons}/**/*')
    .pipe(gulpIf(isDevMode, changed('dist/assets')))
    .pipe(gulpIf(!INCLUDE_ROBOTS, filter((file) => !/resources[\\\/]robots\.txt/.test(file.path))))
    .pipe(gulpIf(isDevMode, gulp.dest('dist')))
    .pipe(gulpIf(!isDevMode, gulp.dest('build/assets')))
));

gulp.task('copy:other', () => (
  gulp.src('src/resources/other/**/*')
    .pipe(gulp.dest('build/'))
));
