const gulp = require('gulp');

// HTML
const fileInclude = require('gulp-file-include');
const htmlclean = require('gulp-htmlclean');
const webpHtml = require('gulp-webp-html')

// SASS
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const ccso = require('gulp-csso');
const webpCss = require('gulp-webp-css');
// const sassGlob = require('gulp-sass-glob');

const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourceMaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
const changed = require('gulp-changed');
// Images
const webp = require('gulp-webp');
// const imagemin = require('gulp-imagemin');


gulp.task('clean:docs', function (done) {
  if (fs.existsSync('./docs/')) {
    return gulp
      .src('./docs/', { read: false })
      .pipe(clean({ force: true }));
  }

  done()
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
      sound: false
    })
  }
}

gulp.task('html:docs', function () {
  return gulp
    // .src('./src/html/**/*.html')
    .src(['./src/html/**/*.html', '!./src/html/components/*.html'])
    .pipe(changed('./docs/'))
    .pipe(plumber(plumberNotify('HTML')))
    .pipe(fileInclude(fileInclueSettings))
    .pipe(webpHtml())
    .pipe(htmlclean())
    .pipe(gulp.dest('./docs/'));
});

gulp.task('sass:docs', function () {
  return gulp
    .src('./src/scss/*.scss')
    .pipe(changed('./docs/css/'))
    .pipe(plumber(plumberNotify('SCSS')))
    .pipe(sourceMaps.init())
    .pipe(autoprefixer())
    // .pipe(sassGlob())
    .pipe(webpCss())
    .pipe(sass())
    .pipe(ccso())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest('./docs/css/'));
});

// gulp.task('images:webp', function () {
//   return gulp
//     .src('./src/img/**/*.{png,jpg,jpeg}')
//     .pipe(changed('./docs/img/', {
//       extension: '.webp',
//       hasChanged: changed.compareLastModifiedTime
//     }))
//     .pipe(webp({ quality: 80 }))
//     .pipe(gulp.dest('./docs/img/'));
// });

// gulp.task('images:copy', function () {
//   return gulp
//     .src('./src/img/**/*.{png,jpg,jpeg,svg,gif}')
//     .pipe(changed('./docs/img/'))
//     .pipe(gulp.dest('./docs/img/'));
// });

// gulp.task('images:docs', gulp.series('images:webp', 'images:copy'));

gulp.task('images:docs', function () {
  return gulp
    .src('./src/img/**/*')
    .pipe(changed('./docs/img/'))
    .pipe(webp())
    .pipe(gulp.dest('./docs/img/'))
    .pipe(gulp.src('./src/img/**/*'))
    .pipe(changed('./docs/img/'))
    // .pipe(imagemin({ verbose: true }))
    .pipe(gulp.dest('./docs/img/'));
});

gulp.task('fonts:docs', function () {
  return gulp
    .src('./src/fonts/**/*')
    .pipe(changed('./docs/fonts/'))
    .pipe(gulp.dest('./docs/fonts/'));
});

gulp.task('files:docs', function () {
  return gulp
    .src('./src/files/**/*')
    .pipe(changed('./docs/files/'))
    .pipe(gulp.dest('./docs/files/'));
});

gulp.task('js:docs', function() {
  return gulp
    .src('./src/js/*.js')
    .pipe(changed('./docs/js/'))
    .pipe(plumber(plumberNotify('JS')))
    .pipe(babel())
    .pipe(webpack(require('./../webpack.config.js')))
    .pipe(gulp.dest('./docs/js/'))
})

const serverOptions = {
  livereload: true,
  open: true,
};

gulp.task('server:docs', function () {
  return gulp.src('./docs/').pipe(server(serverOptions));
});




