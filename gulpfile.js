// --------------------------------------------------------------------------------
// Gulp
// --------------------------------------------------------------------------------
const { src, dest, parallel, watch } = require('gulp');

// --------------------------------------------------------------------------------
// CSS
// --------------------------------------------------------------------------------
const sass = require('gulp-sass');
const pcss = require('gulp-postcss');
const cmq = require('postcss-combine-media-query');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('cssnano');

// --------------------------------------------------------------------------------
// JS
// --------------------------------------------------------------------------------
const webpack = require('webpack-stream');

// --------------------------------------------------------------------------------
// File Paths
// --------------------------------------------------------------------------------
const files = {
  scss: './src/scss/**/*.scss',
  js: './src/js/**/*.js',
};

// --------------------------------------------------------------------------------
// Tasks
// --------------------------------------------------------------------------------
const scss = () =>
  src(files.scss, { sourcemaps: true })
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(pcss([cmq(), cssnano()]))
    .pipe(dest('./dist/css', { sourcemaps: '.' }));

const js = () =>
  src(files.js, { sourcemaps: true })
    .pipe(webpack(require('./webpack.config')))
    .pipe(dest('./dist/js', { sourcemaps: '.' }));

const watchTasks = () => watch([files.scss, files.js], parallel(scss, js));

// --------------------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------------------
exports.scss = scss;
exports.js = js;
exports.watchTasks = watchTasks;
exports.default = parallel(scss, js, watchTasks);
