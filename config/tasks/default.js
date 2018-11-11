import gulp from 'gulp';

gulp.task('styles:dependencies', gulp.series(
  'icons',
  'styles',
));

gulp.task('watching', gulp.parallel('server', 'watch'));

gulp.task('default', gulp.series(
  'clean',
  'copy',
  'styles:dependencies',
  'templates',
  'watching'
));

gulp.task('build', gulp.series(
  'clean:build',
  'styles:dependencies',
  'scripts',
  'copy',
  'copy:other',
  'templates:build',
));
