'use strict';

/* Contants ---------------------------------------------------------------- */
var paths = {
    html: ['./src/html/*.html'],
    css: ['./src/css/*.css'],
    dest: {
        dist: './dist',
        dev: './dev'
    }
};


/* Tools ------------------------------------------------------------------- */
var gulp = require('gulp');
var livereload = require('gulp-livereload');
var preprocess = require('gulp-preprocess');


/* Compressors ------------------------------------------------------------- */
var minifycs = require('gulp-minify-css');


/* Static file related tasks --------------------------------------------- */
gulp.task('copy-static', function(){
      gulp.src('./src/lib/codemirror/*')
          .pipe(gulp.dest(paths.dest.dist + '/lib/codemirror/'));
});

/* HTML related tasks ------------------------------------------------------ */
gulp.task('dev-html', function(){
    gulp.src(paths.html)
        .pipe(preprocess({
            context: {DEV: true}
        }))
        .pipe(gulp.dest(paths.dest.dev))
        .pipe(livereload());
});

gulp.task('build-html', function(){
    gulp.src(paths.html)
        .pipe(preprocess({
            context: {}
        }))
        .pipe(gulp.dest(paths.dest.dist));
});

/* CSS related tasks ------------------------------------------------------- */
gulp.task('dev-css', function(){
    gulp.src(paths.css)
        .pipe(livereload());
});

gulp.task('build-css', function(){
    gulp.src(paths.css)
        .pipe(minifycs())
        .pipe(gulp.dest(paths.dest.dist));
});

/* Task chains ------------------------------------------------------------- */
gulp.task('dev', ['dev-css', 'dev-html'], function(){
    livereload.listen();

    gulp.watch(paths.css, ['dev-css']);
    gulp.watch(paths.html, ['dev-html']);
});

gulp.task('default', ['build-css', 'build-html', 'copy-static']);