import gulp from 'gulp';
import notify from 'gulp-notify';
import plumber from 'gulp-plumber';
import pug from 'gulp-pug';
import { create as browserSync } from 'browser-sync';
import url from 'url';

export const bs = browserSync('server');
const { PORT, NOT_OPEN, TUNNEL } = process.env;

gulp.task('server', () => (
  initServer()
));

export const initServer = () => {
  if (bs.active) {
    return bs;
  }

  return bs.init({
    files: ['dist/**/*', '!dist/**/*.html'],
    open: !NOT_OPEN,
    reloadOnRestart: true,
    port: PORT || 3000,
    snippetOptions: {
      rule: {
        match: /<\/body>/i
      }
    },
    ui: false,
    notify: false,
    ghostMode: false,
    server: {
      baseDir: [
        'dist',
        'src'
      ],
      routes: {
        '/assets': 'src/resources'
      },
      directory: true,
      middleware: [pugRebuilder]
    },
    tunnel: !!TUNNEL,
  });
};

const pugRebuilder = (req, res, next) => {
  const regexp = /(\.html$)|(\/$)/i;
  let pathname = url.parse(req.url).pathname;

  if (regexp.test(pathname)) {
    pathname = pathname.replace(/\?.*/i, '');
    pathname = pathname.replace(/#.*/i, '');
    pathname = pathname.replace(regexp, (str, p1, p2) => {
      if (p2) {
        return str.replace(p2, '/index.pug');
      }
      return str.replace(p1, '.pug');
    });
    buildPug(pathname).on('end', () => next());
  } else {
    next();
  }
};

const buildPug = (path) => {
  bs.notify('Compiling HTML');
  /* eslint-disable */
  console.log('Rebuild ', 'src/pages' + path);
  /* eslint-enable */
  return gulp.src([`src/pages/${path}`], { base: 'src/pages/' })
    .pipe(plumber({
      errorHandler: notify.onError((err) => ({
        title: 'HTML',
        message: err.message
      }))
    }))
    .pipe(pug({
      basedir: 'src',
      pretty: true
    }))
    .pipe(gulp.dest('dist/'));
};
