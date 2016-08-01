var del = require('del');
var vinylpaths = require('vinyl-paths');

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
var exceptDist = '!./dist';

gulp.task('clean:css', () => {
  console.log('Delete CSS files located under /dist/web/css');
  del.sync([
    dist + '/web/css/**/*.css'
  ]);
});
gulp.task('clean:js', () => {
  console.log('Delete JS files located under /dist/** except for /dist/lib');
  del.sync([
    dist + '/**/*.js',
    exceptDist + '/web/lib',
    exceptDist + '/web/lib/**/*.js'
  ]);
});

gulp.task('sass', ['clean:css', 'sass:impl']);

gulp.task('sass:impl', () => {
  console.log('Compile SCSS files as CSS');
  gulp.src('./sass/**/*.scss')
    .pipe(plumber())
    .pipe(autoprefier())
    .pipe(sass())
    .pipe(gulp.dest(dist + '/web/css'));
});

gulp.task('cssmin', () => {
  console.log('Minify CSS files as *.min.css files');
  gulp.src(dist + '/web/css/**/*.css')
    .pipe(plumber())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(dist + '/web/css'));
});

gulp.task('ts', ['clean:js', 'ts:impl'], () => {
  console.log('Transpile TypeScript files as JavaScript files');
});

gulp.task('ts:impl', ['ts:electron', 'ts:web']);

gulp.task('ts:electron', shell.task(
  'tsc -out dist/all.js ts/main.ts;'
));;

gulp.task('ts:web', ['ts:web:preview', 'ts:web:inspector', 'ts:web:webview']);

gulp.task('ts:web:preview', shell.task(
  'tsc -out dist/web/js/preview.js ts/web/preview.ts'
));

gulp.task('ts:web:inspector', shell.task(
  'tsc -out dist/web/js/inspector.js ts/web/inspector.ts'
));

gulp.task('ts:web:webview', shell.task(
  'tsc -out dist/web/js/webview.js ts/web/webview.ts'
));


gulp.task('sass:watch', () => {
  gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('ts:watch', () => {
  gulp.watch('./ts/**/*.ts', ['ts']);
});

gulp.task('watch', ['sass:watch', 'ts:watch']);
