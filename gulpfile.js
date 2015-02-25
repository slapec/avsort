'use strict';

/* Contants ---------------------------------------------------------------- */
var paths = {
    js: [
        './gulpfile.js',
        './src/js/*.js',
        './src/js/avsort/*.js'
    ],
    html: ['./src/html/*.html'],
    css: ['./src/css/*.css'],
    readme: ['README.md'],
    dest: {
        dist: './dist',
        dev: './dev'
    }
};
var packageJson = require('./package.json');
var packageName = packageJson.name;
var entryPoint = packageJson.main;


/* Tools ------------------------------------------------------------------- */
var fs = require('fs');

var gulp = require('gulp');
var livereload = require('gulp-livereload');
var marked = require('marked');
var preprocess = require('gulp-preprocess');
var source = require('vinyl-source-stream');


/* Linters ----------------------------------------------------------------- */
var jshint = require('gulp-jshint');


/* Linkers ----------------------------------------------------------------- */
var browserify = require('browserify');


/* Compressors ------------------------------------------------------------- */
var minifycs = require('gulp-minify-css');


/* Static file related tasks ----------------------------------------------- */
gulp.task('copy-static', function(){
      gulp.src('./src/lib/codemirror/*')
          .pipe(gulp.dest(paths.dest.dist + '/lib/codemirror/'));
});


/* JS related tasks -------------------------------------------------------- */
gulp.task('lint-js', function(){
    gulp.src(paths.js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('dev-js', ['lint-js'], function(){
    browserify(entryPoint, {debug: true})
        .bundle()
        .pipe(source(packageName + '.js'))
        .pipe(gulp.dest(paths.dest.dev))
        .pipe(livereload());
});

gulp.task('build-js', ['lint-js'], function(){
    browserify(entryPoint)
        .bundle()
        .pipe(source(packageName + '.js'))
        .pipe(gulp.dest(paths.dest.dist));
});

/* HTML related tasks ------------------------------------------------------ */
gulp.task('dev-html', function(){
    var readme = marked(fs.readFileSync(paths.readme[0], 'utf8'));

    gulp.src(paths.html)
        .pipe(preprocess({
            context: {
                DEV: true,
                readme: readme
            }
        }))
        .pipe(gulp.dest(paths.dest.dev))
        .pipe(livereload());
});

gulp.task('build-html', function(){
    var readme = marked(fs.readFileSync(paths.readme[0], 'utf8'));

    gulp.src(paths.html)
        .pipe(preprocess({
            context: {
                readme: readme
            }
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
gulp.task('dev', ['dev-js', 'dev-css', 'dev-html'], function(){
    livereload.listen();

    gulp.watch(paths.js, ['dev-js']);
    gulp.watch(paths.css, ['dev-css']);
    gulp.watch(paths.html, ['dev-html']);
    gulp.watch(paths.readme, ['dev-html']);
});

gulp.task('default', ['build-js', 'build-css', 'build-html', 'copy-static']);