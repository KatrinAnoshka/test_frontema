import gulp from 'gulp';
import rimraf from 'rimraf';

gulp.task('clean', (callback) => {
  rimraf('dist', callback)
});

gulp.task('clean:build', (callback) => {
  rimraf('build', callback)
});
