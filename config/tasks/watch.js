import gulp, { watch } from 'gulp';
import {get as browserSync} from 'browser-sync';

const bs = browserSync('server');

const reload = (path) => (cb) => {
  bs.reload(path);
  cb();
};

gulp.task('watch:styles', () => {
  return watch(
    'src/{resources,blocks,pages,pp,utils}/**/*.scss',
    gulp.series('styles', reload('assets/css/main.min.css'))
  );
});

gulp.task('watch:templates', () => {
  return watch(
    ['src/{pages,blocks}/**/*.pug'],
    reload()
  );
});

gulp.task('watch:copy', () => {
  return watch(
    ['src/resources/other/**/*'],
    gulp.series('copy', reload())
  );
});

gulp.task('watch:icons', () => {
  return watch(
    'src/resources/icons/**/*.svg',
    gulp.series('icons', reload())
  );
});

gulp.task('watch', gulp.parallel('watch:icons', 'watch:copy', 'watch:templates', 'watch:styles', 'scripts:watch'));
