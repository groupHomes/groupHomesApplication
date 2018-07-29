var gulp = require('gulp');
var sass = require('gulp-sass');
var concatCss = require('gulp-concat-css');

gulp.task('sass', function () {
  return gulp.src(['./app/assets/sass/imports.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(concatCss('app.css'))
    .pipe(gulp.dest('./app/assets/css'));
});


//Watch task
gulp.task('default',function() {
  gulp.watch("./app/views/**/*.scss", ['sass']);
});
