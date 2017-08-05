const gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var less = require('gulp-less');
var refresh = require('gulp-livereload');
var lr = require('tiny-lr');
var server = lr();
var minifyCSS = require('gulp-minify-css');
var embedlr = require('gulp-embedlr');
connect = require('connect'); // Webserver
module.exports = gulp;
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');



// Локальный сервер для разработки
/*gulp.task('http-server', function() {
    //.pipe(connect())
    // .use(require('connect-livereload')())
        //.use(connect.static('./assets'))
        .use(connect.static('./index.html'))
        .listen('9000');

    console.log('Server listening on http://localhost:9000');
});*/
/*var MyMethods = require('./script.js');
var method = MyMethods.method;
var otherMethod = MyMethods.otherMethod;*/

gulp.task('es6', function() {
    browserify({
        entries: 'dev/js/**/*.js',
        debug: true
    })
        .transform(babelify)
        .on('error', gutil.log)
        .bundle()
        .on('error', gutil.log)
        .pipe(source('main.js'))
        .pipe(gulp.dest(''));
});

var config = {
    server: {
        baseDir: "./dist"
    },

    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Devil"
};

gulp.task('scripts', function () {
    gulp.src(['dev/js/**/*.js'],['es6'])
        .pipe(browserify())
        //.pipe(concat('main.js'))
        .pipe(gulp.dest('dist'))
        .pipe(refresh(server))
});

gulp.task('styles', function() {
    gulp.src(['dev/styles/main.less'])
        .pipe(less())
        .pipe(minifyCSS())
        .pipe(gulp.dest('dist'))
        .pipe(refresh(server))
});

gulp.task('html', function() {
    gulp.src("*.html")
        .pipe(embedlr())
        .pipe(gulp.dest('dist'))
        .pipe(refresh(server));
});

gulp.task('lr-server', function() {
    server.listen(35729, function(err) {
        if(err) return console.log(err);})
});


gulp.task('default', function() {

        gulp.run('lr-server', 'scripts', 'styles', 'html');

        gulp.watch('dev/**', function(event) {
            gulp.run('scripts');
        });

        gulp.watch('dev/styles/**', function(event) {
            gulp.run('styles');
        });

        gulp.watch('*.html', function(event) {
            gulp.run('html');
        });
    //gulp.run('http-server');
});

/*
gulp.task('default', function() {
    gulp.run('lr-server', 'scripts', 'styles', 'html');

    gulp.watch('dev/!**', function(event) {
        gulp.run('scripts');
    });

    gulp.watch('dev/styles/!**', function(event) {
        gulp.run('styles');
    });

    gulp.watch('*.html', function(event) {
        gulp.run('html');
    });
});*/
