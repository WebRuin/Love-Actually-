'use strict'

var autoprefixer = require('gulp-autoprefixer')
var csso = require('gulp-csso')
var del = require('del')
var gulp = require('gulp')
var htmlmin = require('gulp-htmlmin')
var runSequence = require('run-sequence')
var sass = require('gulp-sass')
var uglify = require('gulp-uglify')

// // Set the browser that you want to supoprt
// const AUTOPREFIXER_BROWSERS = [
//   'ie >= 10',
//   'ie_mob >= 10',
//   'ff >= 30',
//   'chrome >= 34',
//   'safari >= 7',
//   'opera >= 23',
//   'ios >= 7',
//   'android >= 4.4',
//   'bb >= 10',
// ]

// Gulp task to minify CSS files
gulp.task('styles', function() {
  return (
    gulp
      .src([
        './src/assets/scss/styles.scss',
        './src/assets/scss/normalize.scss',
      ])
      // Compile SASS files
      .pipe(
        sass({
          outputStyle: 'nested',
          precision: 10,
          includePaths: ['.'],
          onError: console.error.bind(console, 'SCSS error:'),
        })
      )
      // Auto-prefix css styles for cross browser compatibility
      // .pipe(autoprefixer({ browsers: AUTOPREFIXER_BROWSERS }))
      // Minify the file
      .pipe(csso())
      // Output
      .pipe(gulp.dest('./dist/css'))
  )
})

// Gulp task to minify JavaScript files
gulp.task('scripts', function() {
  return (
    gulp
      .src('./src/assets/js/**/*.js')
      // Minify the file
      .pipe(uglify())
      // Output
      .pipe(gulp.dest('./dist/js'))
  )
})

// Gulp task to minify HTML files
gulp.task('pages', function() {
  return gulp
    .src(['./src/**/*.html'])
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true,
      })
    )
    .pipe(gulp.dest('./dist'))
})

gulp.task('copy', function() {
  gulp.src('./theme-song.mp3').pipe(gulp.dest('./dist/public/'))
})

// Clean output directory
gulp.task('clean', () => del(['dist']))

// Gulp task to minify all files
gulp.task('default', ['clean'], function() {
  runSequence('styles', 'scripts', 'pages', 'copy')
})
