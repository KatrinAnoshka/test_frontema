import gulp from 'gulp';
import svgmin from 'gulp-svgmin';
import svgSymbols from 'gulp-svg-symbols';
import gulpIf from 'gulp-if';
import rename from 'gulp-rename';
import plumber from 'gulp-plumber';
import errorHandler from 'gulp-plumber-error-handler';
import path from 'path';

gulp.task('icons', () => (
  gulp.src('src/resources/icons/**/*.svg')
    .pipe(plumber({errorHandler: errorHandler(`Error in 'icons' task`)}))
    .pipe(svgmin({
        full: true,
        plugins: [{
          removeEditorsNSData: true,
        }, {
          removeUnusedNS: true,
        }, {
          removeMetadata: true,
        }, {
          convertStyleToAttrs: true,
        }, {
          removeUselessDefs: false,
        }, {
          removeUnknownsAndDefaults: false,
        }, {
          mergePaths: false,
        }, {
          convertPathData: false,
        }, {
          removeEmptyAttrs: false,
        }, {
          removeUselessStrokeAndFill: false,
        }, {
          cleanupIDs: false,
        }, {
          removeViewBox: false,
        }, {
          removeComments: true,
        }, {
          convertShapeToPath: false,
        }],
        js2svg: {
          pretty: true,
        },
    }))
    .pipe(svgSymbols({
      title: false,
      id: 'icon_%f',
      class: 'u-icon_%f',
      templates: [
        path.join(__dirname, '../icon-templates/icons.scss'),
        path.join(__dirname, '../icon-templates/icons.svg'),
      ]
    }))
    .pipe(gulpIf(/\.scss$/, rename('icon.scss')))
    .pipe(gulpIf(/\.scss$/, gulp.dest('src/blocks/library/icon')))
    .pipe(gulpIf(/\.svg$/, rename('icons.svg')))
    .pipe(gulpIf(/\.svg$/, gulp.dest('src/resources/images')))
));
