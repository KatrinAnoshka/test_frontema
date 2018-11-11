import gulp from 'gulp';
import sass from 'gulp-sass';
import plumber from 'gulp-plumber';
import gulpIf from 'gulp-if';
import sourcemaps from 'gulp-sourcemaps';
import nano from 'gulp-cssnano';
import rename from 'gulp-rename';
import errorHandler from 'gulp-plumber-error-handler';
import sassGlob from 'gulp-sass-glob';

const isDevMode = process.argv.indexOf('--production') === -1;;

gulp.task('styles', () => (
  gulp.src('src/resources/styles/*.scss')
    .pipe(plumber({ errorHandler: errorHandler(`Error in \'styles\' task`) }))
    .pipe(sassGlob())
    .pipe(gulpIf(isDevMode, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpIf(!isDevMode, nano({ zindex: false })))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulpIf(isDevMode, sourcemaps.write()))
    .pipe(gulpIf(isDevMode, gulp.dest('dist/assets/css')))
    .pipe(gulpIf(!isDevMode, gulp.dest('build/assets/css')))
));
