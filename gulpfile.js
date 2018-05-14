'use strict';

// sass compile
var gulp = require('gulp');
var sass = require('gulp-sass');
var prettify = require('gulp-prettify');
var minifyCss = require("gulp-minify-css");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var rtlcss = require("gulp-rtlcss");
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');
var plumber = require('gulp-plumber');
var bytediff = require('gulp-bytediff');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();
var del = require('del');

//*** Localhost server tast
gulp.task('localhost', function () {
    connect.server();
});

gulp.task('localhost-live', function () {
    connect.server({
        livereload: true
    });
});

// browserSync
// process JS files and return the stream.

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', ['app-minify'], function (done) {
    browserSync.reload();
    done();
});
gulp.task('css-html-modules-watch', ['css-html-modules'], function (done) {
    browserSync.reload();
    done();
});

// use default task to launch Browsersync and watch JS files
gulp.task('default', ['prod'], function () {

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch("src/**/*.js", ['js-watch']);
    gulp.watch(['./src/*.html', './src/app/**/*.html', './src/app/config/config.js', './src/app/**/*.css'], ['css-html-modules-watch']);
});
// End browserSync

//*** SASS compiler task
gulp.task('sass', function () {
    // bootstrap compilation
    gulp.src('./sass/bootstrap.scss').pipe(sass()).pipe(gulp.dest('./assets/global/plugins/bootstrap/css/'));

    // select2 compilation using bootstrap variables
    gulp.src('./assets/global/plugins/select2/sass/select2-bootstrap.min.scss').pipe(sass({ outputStyle: 'compressed' })).pipe(gulp.dest('./assets/global/plugins/select2/css/'));

    // global theme stylesheet compilation
    gulp.src('./sass/global/*.scss').pipe(sass()).pipe(gulp.dest('./assets/global/css'));

    // theme layouts compilation
    gulp.src('./sass/layouts/layout/*.scss').pipe(sass()).pipe(gulp.dest('./assets/layouts/layout/css'));
    gulp.src('./sass/layouts/layout/themes/*.scss').pipe(sass()).pipe(gulp.dest('./assets/layouts/layout/css/themes'));

});

//*** SASS watch(realtime) compiler task
gulp.task('sass:watch', function () {
    gulp.watch('./sass/**/*.scss', ['sass']);
});

//*** CSS & JS minify task
gulp.task('minify', function () {
    // css minify

    gulp.src(['./assets/global/css/*.css', '!./assets/global/css/*.min.css']).pipe(minifyCss()).pipe(rename({ suffix: '.min' })).pipe(gulp.dest('./assets/global/css/'));
    gulp.src(['./assets/layouts/**/css/*.css', '!./assets/layouts/**/css/*.min.css']).pipe(rename({ suffix: '.min' })).pipe(minifyCss()).pipe(gulp.dest('./assets/layouts/'));
    gulp.src(['./assets/layouts/**/css/**/*.css', '!./assets/layouts/**/css/**/*.min.css']).pipe(rename({ suffix: '.min' })).pipe(minifyCss()).pipe(gulp.dest('./assets/layouts/'));
    gulp.src(['./assets/global/plugins/bootstrap/css/*.css', '!./assets/global/plugins/bootstrap/css/*.min.css']).pipe(minifyCss()).pipe(rename({ suffix: '.min' })).pipe(gulp.dest('./assets/global/plugins/bootstrap/css/'));

    //js minify
    gulp.src(['./assets/global/scripts/*.js', '!./assets/global/scripts/*.min.js']).pipe(uglify()).pipe(rename({ suffix: '.min' })).pipe(gulp.dest('./assets/global/scripts'));
    gulp.src(['./assets/layouts/**/scripts/*.js', '!./assets/layouts/**/scripts/*.min.js']).pipe(uglify()).pipe(rename({ suffix: '.min' })).pipe(gulp.dest('./assets/layouts/'));

});


gulp.task('minify-css-components', function () {
    // css minify

    gulp.src(['./src/app/**/*.css'])
        .pipe(concat('styles.css'))
        .pipe(minifyCss())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/'))
        .pipe(gulp.dest('src/'));


});



gulp.task('css-html-modules', ['minify-css-components'], function() {
    gulp.src(['./src/app/**/*.html']).pipe(gulp.dest('./dist/app'));
    gulp.src(['./src/img/*']).pipe(gulp.dest('./dist/img'));
    gulp.src(['./src/*.html']).pipe(gulp.dest('./dist'));
    gulp.src(['./src/*.ico']).pipe(gulp.dest('./dist'));
    gulp.src(['./src/app/config/config.js']).pipe(gulp.dest('./dist/app/config/'));
});

gulp.task('vendor', function () {

    gulp.src(['./assets/global/img/remove-icon-small.png']).pipe(gulp.dest('./dist/vendor/global/img')).pipe(gulp.dest('./src/vendor/global/img'));
    gulp.src(['./assets/global/plugins/font-awesome/**/*']).pipe(gulp.dest('./dist/vendor/global/plugins/font-awesome')).pipe(gulp.dest('./src/vendor/global/plugins/font-awesome'));
    gulp.src(['./assets/global/plugins/simple-line-icons/**/*']).pipe(gulp.dest('./dist/vendor/global/plugins/simple-line-icons')).pipe(gulp.dest('./src/vendor/global/plugins/simple-line-icons'));
    gulp.src(['./assets/global/plugins/bootstrap/**/*']).pipe(gulp.dest('./dist/vendor/global/plugins/bootstrap')).pipe(gulp.dest('./src/vendor/global/plugins/bootstrap'));
    gulp.src(['./assets/global/plugins/bootstrap-switch/**/*']).pipe(gulp.dest('./dist/vendor/global/plugins/bootstrap-switch')).pipe(gulp.dest('./src/vendor/global/plugins/bootstrap-switch'));
    gulp.src(['./assets/global/plugins/angularjs/**/**/*']).pipe(gulp.dest('./dist/vendor/global/plugins/angularjs')).pipe(gulp.dest('./src/vendor/global/plugins/angularjs'));
    gulp.src(['./assets/global/plugins/select2/**/*']).pipe(gulp.dest('./dist/vendor/global/plugins/select2')).pipe(gulp.dest('./src/vendor/global/plugins/select2'));
    gulp.src(['./assets/global/plugins/bootstrap-select/**/*']).pipe(gulp.dest('./dist/vendor/global/plugins/bootstrap-select')).pipe(gulp.dest('./src/vendor/global/plugins/bootstrap-select'));
    gulp.src(['./assets/global/plugins/bootstrap-daterangepicker/**/*']).pipe(gulp.dest('./dist/vendor/global/plugins/bootstrap-daterangepicker')).pipe(gulp.dest('./src/vendor/global/plugins/bootstrap-daterangepicker')); //
    gulp.src(['./assets/global/scripts/**/*']).pipe(gulp.dest('./dist/vendor/global/scripts')).pipe(gulp.dest('./src/vendor/global/scripts'));
    gulp.src(['./assets/global/css/**/*']).pipe(gulp.dest('./dist/vendor/global/css')).pipe(gulp.dest('./src/vendor/global/css'));
    gulp.src(['./assets/layouts/**/*']).pipe(gulp.dest('./dist/vendor/layouts')).pipe(gulp.dest('./src/vendor/layouts'));
    gulp.src(['./assets/global/plugins/*.js']).pipe(gulp.dest('./dist/vendor/global/plugins')).pipe(gulp.dest('./src/vendor/global/plugins'));
    gulp.src(['./assets/global/plugins/bootstrap-hover-dropdown/**/*']).pipe(gulp.dest('./dist/vendor/global/plugins/bootstrap-hover-dropdown')).pipe(gulp.dest('./src/vendor/global/plugins/bootstrap-hover-dropdown'));
    gulp.src(['./assets/global/plugins/jquery-slimscroll/**/*']).pipe(gulp.dest('./dist/vendor/global/plugins/jquery-slimscroll')).pipe(gulp.dest('./src/vendor/global/plugins/jquery-slimscroll'));
    gulp.src(['./assets/global/plugins/bootstrap-modal/**/*']).pipe(gulp.dest('./dist/vendor/global/plugins/bootstrap-modal')).pipe(gulp.dest('./src/vendor/global/plugins/bootstrap-modal'));
    gulp.src(['./assets/global/plugins/bootstrap-sweetalert/**/*']).pipe(gulp.dest('./dist/vendor/global/plugins/bootstrap-sweetalert')).pipe(gulp.dest('./src/vendor/global/plugins/bootstrap-sweetalert'));

    // Updates and external lib
    gulp.src(['./src/vendor/global/plugins/angularjs/plugins/angular-daterangepicker/**/*']).pipe(gulp.dest('./dist/vendor/global/plugins/angularjs/plugins/angular-daterangepicker')).pipe(gulp.dest('./src/vendor/global/plugins/angularjs/plugins/angular-daterangepicker'));
    gulp.src(['./node_modules/angular-permission/dist/angular-permission-ng.min.js']).pipe(gulp.dest('./dist/vendor/global/plugins/angularjs/plugins/angular-permission')).pipe(gulp.dest('./src/vendor/global/plugins/angularjs/plugins/angular-permission'));
    gulp.src(['./node_modules/angular-permission/dist/angular-permission-ui.min.js']).pipe(gulp.dest('./dist/vendor/global/plugins/angularjs/plugins/angular-permission')).pipe(gulp.dest('./src/vendor/global/plugins/angularjs/plugins/angular-permission'));
    gulp.src(['./node_modules/angular-permission/dist/angular-permission.min.js']).pipe(gulp.dest('./dist/vendor/global/plugins/angularjs/plugins/angular-permission')).pipe(gulp.dest('./src/vendor/global/plugins/angularjs/plugins/angular-permission'));
    gulp.src(['./node_modules/crypto-js/*']).pipe(gulp.dest('./dist/vendor/global/plugins/crypto-js')).pipe(gulp.dest('./src/vendor/global/plugins/crypto-js'));
    gulp.src(['./node_modules/angular-translate/dist/*.js']).pipe(gulp.dest('./dist/vendor/global/plugins/angularjs/plugins/angular-translate')).pipe(gulp.dest('./src/vendor/global/plugins/angularjs/plugins/angular-translate'));
    gulp.src(['./node_modules/angular-translate-loader-partial/*.js']).pipe(gulp.dest('./dist/vendor/global/plugins/angularjs/plugins/angular-translate-loader-partial')).pipe(gulp.dest('./src/vendor/global/plugins/angularjs/plugins/angular-translate-loader-partial'));

});

gulp.task('app', function() {
    return gulp.src(['src/app/**/app.js', 'src/app/**/*.module.js', 'src/app/**/*.js','!src/app/config/config.js','!src/app.js','!src/app.min.js'])
	    .pipe(plumber())
			.pipe(concat('app.js', {newLine: ';'}))
			.pipe(ngAnnotate({add: true}))
        .pipe(plumber.stop())
        .pipe(gulp.dest('dist/'))
        .pipe(gulp.dest('src/'));
});

gulp.task('app-minify', ['app'], function() {
	gulp.src('src/app.js')
		.pipe(plumber())
			.pipe(bytediff.start())
				.pipe(uglify({mangle: true}))
			.pipe(bytediff.stop())
			.pipe(rename('app.min.js'))
		.pipe(plumber.stop())
		.pipe(gulp.dest('dist/'))
        .pipe(gulp.dest('src/'));
    //del(['src/app.js']);
});

gulp.task('prod', ['app-minify','css-html-modules','vendor']);

// use default task to launch Browsersync and watch JS files
gulp.task('dev', function () {

        // Serve files from the root of this project
        browserSync.init({
            server: {
                baseDir: "./src"
            }
        });

        // add browserSync.reload to the tasks array to make
        // all browsers reload after tasks are complete.
        gulp.watch("src/**/*.js", {debounceDelay: 2000}, ['js-watch']);
        gulp.watch(['./src/*.html', './src/app/**/*.html', './src/app/config/config.js', './src/app/**/*.css'], ['css-html-modules-watch']);
});
