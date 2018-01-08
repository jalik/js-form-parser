/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2018 Karl STEIN
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
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const gulp = require("gulp");
const babel = require("gulp-babel");
const stripComments = require("gulp-strip-comments");
const watch = require("gulp-watch");
const distPath = "dist";

// Compile JavaScript files
gulp.task("build", () => {
    return gulp.src([
        "src/**/*.js"
    ])
        .pipe(babel({presets: ["env"]}))
        .pipe(stripComments())
        .pipe(gulp.dest(distPath));
});

// Compile source files
gulp.task("default", ["build"]);

// Prepare files for publication
gulp.task("prepublish", ["build"]);

// Rebuild automatically
gulp.task("watch", () => {
    gulp.watch(["src/**/*.js"], ["build"]);
});
