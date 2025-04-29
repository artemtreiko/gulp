import gulp from 'gulp';
import fileInclude from 'gulp-file-include';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const webpackConfig = require('../webpack.config.cjs');

// const sass = require('gulp-sass')(require('sass'));
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import server from 'gulp-server-livereload'; //!
import clean from 'gulp-clean'; //!
import fs from 'fs';

import sourceMaps from 'gulp-sourcemaps';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify'; //!
import webpack from 'webpack-stream';
import babel from 'gulp-babel';
// import imagemin from 'gulp-imagemin';
import changed from 'gulp-changed';

const sass = gulpSass(dartSass);

gulp.task('clean:dev', function (done) {
  if (fs.existsSync('./build/')) {
    return gulp.src('./build/', { read: false }).pipe(clean({ force: true }));
  }

  done();
});

const fileInclueSettings = {
  prefix: '@@',
  basePath: '@file',
};

const plumberNotify = (title) => {
  return {
    errorHandler: notify.onError({
      title: title,
      message: 'Error <%= error.message %>',
      sound: false,
    }),
  };
};

gulp.task('html:dev', function () {
  return gulp
    .src(['./src/html/**/*.html', '!./src/html/components/*.html'])
    .pipe(changed('./build/'))
    .pipe(plumber(plumberNotify('HTML')))
    .pipe(fileInclude(fileInclueSettings))
    .pipe(gulp.dest('./build/'));
});

gulp.task('sass:dev', function () {
  return (
    gulp
      .src('./src/scss/*.scss')
      .pipe(changed('./build/css/'))
      .pipe(plumber(plumberNotify('SCSS')))
      .pipe(sourceMaps.init())
      // .pipe(sassGlob())
      .pipe(sass())
      .pipe(sourceMaps.write())
      .pipe(gulp.dest('./build/css/'))
  );
});

gulp.task('images:dev', function () {
  return (
    gulp
      .src('./src/img/**/*')
      .pipe(changed('./build/img/'))
      // .pipe(imagemin({ verbose: true })) //? commented ?
      .pipe(gulp.dest('./build/img/'))
  );
});

gulp.task('fonts:dev', function () {
  return gulp
    .src('./src/fonts/**/*')
    .pipe(changed('./build/fonts/'))
    .pipe(gulp.dest('./build/fonts/'));
});

gulp.task('files:dev', function () {
  return gulp
    .src('./src/files/**/*')
    .pipe(changed('./build/files/'))
    .pipe(gulp.dest('./build/files/'));
});

gulp.task('js:dev', function () {
  return gulp
    .src('./src/js/*.js')
    .pipe(changed('./build/js/'))
    .pipe(plumber(plumberNotify('JS')))
    .pipe(babel())
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('./build/js/'));
});

const serverOptions = {
  livereload: true,
  open: true,
};

gulp.task('server:dev', function () {
  return gulp.src('./build/').pipe(server(serverOptions));
});

gulp.task('watch:dev', function () {
  gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass:dev'));
  gulp.watch('./src/**/*.html', gulp.parallel('html:dev'));
  gulp.watch('./src/img/**/*', gulp.parallel('images:dev'));
  gulp.watch('./src/fonts/**/*', gulp.parallel('fonts:dev'));
  gulp.watch('./src/files/**/*', gulp.parallel('files:dev'));
  gulp.watch('./src/js/**/*.js', gulp.parallel('js:dev'));
});
