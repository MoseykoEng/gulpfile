const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean-css');
const image = require('gulp-imagemin');
const newer = require('gulp-newer');
const del = require('del');

const workPath = '#src';
const buildPath = 'dist';
const jsMain = 'app.js';

function browsersync(done) {
    browserSync.init({
        server: {
            baseDir: `${workPath}/`,
            port: 3000
        },
        nofify: false,
        online: true
    })

    done();
}
// Минификация JS скрипта
function scripts() {
    return gulp.src(`${workPath}/js/src/${jsMain}`)
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(`${workPath}/js/dist`))
        .pipe(browserSync.stream());

}
// Компиляция из SCSS в min.css + минификация
function style() {
    return gulp.src(`${workPath}/styles/scss/styles.scss`)
        .pipe(sass())
        .pipe(concat('styles.min.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 versions'],
            grid: true
        }))
        .pipe(gulp.dest(`${workPath}/styles/`));
}
// Минификация изображений
function imagein() {
    return gulp.src(`${workPath}/images/src/**/*`)
        .pipe(newer(`${workPath}/images/dist/`))
        .pipe(image())
        .pipe(gulp.dest(`${workPath}/images/dist/`));
}
// Очистка изображений из собранного проекта
function clearImage() {
    return del(`${buildPath}/images/dist/**/*`, {
        force: true
    });
}
// Очистка файлов и каталогов из собранного проекта
function clearDist() {
    return del(`${buildPath}/**/*`);
}
// Билд проекта
function build() {
    return gulp.src([
        `${workPath}/styles/**/*.min.css`,
        `${workPath}/js/**/*.min.js`,
        `${workPath}/image/dest/**/*`,
        `${workPath}/**/*.html`,
    ], { base: workPath }).pipe(gulp.dest(`${buildPath}/`));
}
// Отслеживаем изменения в файлах и изображениях
// Триггерим события
function watch() {
    gulp.watch([
        `${workPath}/js/**/*.js`,
        `!${workPath}/js/**/*.min.js`,
    ], scripts);
    gulp.watch(`${workPath}/styles/**/*.scss`, style);
    gulp.watch(`${workPath}/**/*.html`).on('change', browserSync.reload);
    gulp.watch(`${workPath}/image/src/**/*`, imagein);
}

exports.build = gulp.series(clearDist, style, scripts, imagein, build);
exports.clearDist = gulp.task(clearDist);
exports.clearImg = gulp.task(clearImage);
exports.host = gulp.task(browsersync);
gulp.task('default', gulp.parallel(style, scripts, imagein, browsersync, watch) );