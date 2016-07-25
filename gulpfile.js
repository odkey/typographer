var gulp = require('gulp');
var sass = require('gulp-sass');
var typescript = require('gulp-typescript');
var tsc = require('gulp-tsc');

var shell = require('gulp-shell');
var rename = require('gulp-rename');
var cssmin = require('gulp-cssmin');
var plumber = require('gulp-plumber');
var autoprefier = require('gulp-autoprefixer');

var dist = './dist';

gulp.task('sass', () => {
  console.log('Compile SCSS files as CSS');
  gulp.src('./sass/**/*.scss')
    .pipe(plumber())
    .pipe(autoprefier())
    .pipe(sass())
    .pipe(gulp.dest(dist + '/css'));
  gulp.src(dist + '/css/**/*.css')
    .pipe(plumber())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(dist + '/css'));
});

gulp.task('cssmin', () => {
  console.log('Minify CSS files as *.min.css files');
  gulp.src(dist + '/css/**/*.css')
    .pipe(plumber())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(dist + '/css'));
});

gulp.task('ts', shell.task(
  'tsc -out dist/all.js ts/main.ts;'
));

gulp.task('sass:watch', () => {
  gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('ts:watch', () => {
  gulp.watch('./ts/**/*.ts', ['ts']);
});

gulp.task('watch', ['sass:watch', 'ts:watch']);
