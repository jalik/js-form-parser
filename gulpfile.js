/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const babel = require('gulp-babel');
const del = require('del');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const path = require('path');

const buildPath = path.resolve('dist');
const srcPath = path.resolve('src');
const testPath = path.resolve('test');

// Compile JS files
gulp.task('build:js', () => gulp.src([
  path.join(srcPath, '**', '*.js'),
]).pipe(babel())
  .pipe(gulp.dest(buildPath)));

// Compile all files
gulp.task('build', gulp.parallel(
  'build:js',
));

// Delete previous compiled files
gulp.task('clean', () => del([
  buildPath,
]));

// Run JS lint
gulp.task('eslint', () => gulp.src([
  path.join(srcPath, '**', '*.js'),
  path.join(testPath, '**', '*.js'),
  path.join('!node_modules', '**'),
]).pipe(eslint())
  .pipe(eslint.formatEach())
  .pipe(eslint.failAfterError()));

// Prepare files for production
gulp.task('prepare', gulp.series(
  'clean',
  'build',
  'eslint',
));

// Rebuild JS automatically
gulp.task('watch:js', () => gulp.watch([
  path.join(srcPath, '**', '*.js'),
], gulp.parallel(
  'build:js',
)));

// Rebuild sources automatically
gulp.task('watch', gulp.parallel(
  'watch:js',
));

// Default task
gulp.task('default', gulp.series(
  'prepare',
));
