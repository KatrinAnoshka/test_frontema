import gulp from 'gulp';
import webpack from 'webpack';
import errorHandler from 'gulp-plumber-error-handler';
import statsLogger from 'webpack-stats-logger';
import makeWebpackConfig from '../webpack.conf.js';

const {NODE_ENV, NOTIFY} = process.env;
const isDebug = process.argv.indexOf('--production') === -1;
const scriptsErrorHandler = errorHandler('Error in \'scripts\' task');

function runWebpack(watch = false) {
  return function (callback) {
    const webpackConfig = makeWebpackConfig({
      watch,
      debug: isDebug,
      sourcemaps: isDebug,
      notify: NOTIFY
    });

    return webpack(webpackConfig, (error, stats) => {
      if (error) {
        console.log(error);
      }
      if (stats) {
        const jsonStats = stats.toJson();
        if (jsonStats.errors.length) {
          jsonStats.errors.forEach(message => {
            scriptsErrorHandler.call({emit() {/* noop */}}, {message});
          });
        }
        statsLogger(error, stats);
      }

      if (watch === false) {
        callback();
      }
    });
  };
}

gulp.task('scripts', runWebpack(false));
gulp.task('scripts:watch', runWebpack(true));
