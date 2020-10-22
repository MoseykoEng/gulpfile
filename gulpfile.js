const gulp = require('gulp');
// Browser & General plugins
const browser = require('browser-sync').create();
const concat = require('gulp-concat');
const del = require('del');
// For HTML
const pugConvert = require('gulp-pug');
// For CSS
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
// For JS
const uglify = require('gulp-uglify-es').default;
// For images
const imgmin = require('gulp-imagemin');

// Config
const workDir = '#src';
const buildDir = 'dist';

// Pug | Converting pug files to html files
function pug() {
    return gulp.src(`${workDir}/**/*.pug`, { base: `${workDir}` })
        .pipe(pugConvert({ pretty: true }))
        .pipe( gulp.dest(`${workDir}`) )
        .pipe(browser.stream());
}
// SCSS | Converting
function styles() {
    return gulp.src(`${workDir}/styles/scss/styles.scss`)
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(concat('styles.min.css'))
        .pipe(autoprefixer({ 
            overrideBrowserslist: ['last 2 versions'],
            grid: true
        }))
        .pipe(gulp.dest(`${workDir}/styles/`))
        .pipe(browser.stream());
}
// JS | Minify JS scripts
function scripts() {
    return gulp.src([`${workDir}/js/modules/**/*.js`])
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(`${workDir}/js/`))
        .pipe(browser.stream());
}
// Image-min | Minify images (optipng don't work :c)
function imagemin() {
    gulp.src(`${workDir}/images/**/*`, { base: `${workDir}` })
        .pipe(imgmin())
        .pipe(`${workDir}/images/`);
}
// Browser sync | Init & create local host
function browserSync() {
    return browser.init({
        server: {
            baseDir: `${workDir}`,
            port: 3000
        },
        notify: false,
        online: false,
        buffer: false
    });
}
// Browser sync | Reloading browser after changes
function serve() {
    gulp.watch([
        `${workDir}/js/**/*.js`,
        `!${workDir}/js/**/*.min.js`,
    ], scripts);
    gulp.watch(`${workDir}/styles/scss/**/*.scss`, styles).on('change', browser.reload);
    gulp.watch(`${workDir}/**/*.pug`, pug).on('change', browser.reload);
    // gulp.watch(`${workPath}/image/src/**/*`, imagein);
}
// Build directory
function build() {
    return gulp.src([
        `${workDir}/styles/fonts/**/*`,
        `${workDir}/styles/**/*.min.css`,
        `${workDir}/images/**/*`,
        `${workDir}/js/**/*.min.js`,
        `${workDir}/**/*.html`,
    ], { base: workDir }).pipe(gulp.dest(`${buildDir}/`));
}

function clearDist() {
    return del(`${buildDir}/**/*`);
}

exports.build = gulp.series(clearDist, pug, styles, scripts, build);
exports.default = gulp.parallel(pug, styles, scripts, browserSync, serve);