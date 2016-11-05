var gulp = require('gulp'),
    rollup = require('rollup-stream'),
    source = require('vinyl-source-stream'),
    nodemon = require('gulp-nodemon')
    ;

gulp.task('lodash', function() {
  return rollup('lodash.rollup.config.js')
      .pipe(source('lodash-bundle.js'))
      .pipe(gulp.dest('./dist'))
      ;
});

gulp.task('mobx', function() {
  return rollup('mobx.rollup.config.js')
      .pipe(source('mobx-bundle.js'))
      .pipe(gulp.dest('./dist'))
      ;
});

gulp.task('rollup', function() {
  return rollup('rollup.config.js')
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./dist'))
    ;
});

gulp.task('watch', ['rollup'], function() {
  gulp.watch(['*.js','*.tag'], ['rollup']);
});

gulp.task('server', function () {
  nodemon({
    script: 'server.js'
    , ext: 'js'
    // , watch: ['src/*.*']
    , env: { 'NODE_ENV': 'development' }
  })
})