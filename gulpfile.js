const { src, dest, watch, parallel, series, task } = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const del = require('del');
const webp = require('gulp-webp');


function browsersync() {
   browserSync.init({
      server: {
         baseDir: 'app/'
      }
   });
}

function convertWebp() {
   return src('app/images/**/*.jpg')
      .pipe(webp())
      .pipe(dest('app/images/webp'))
}

function cleanDist() {
   return (del('dist'))
}


function images() {
   return src('app/images/**/*')
      .pipe(imagemin([
         imagemin.gifsicle({ interlaced: true }),
         imagemin.mozjpeg({ quality: 75, progressive: true }),
         imagemin.optipng({ optimizationLevel: 5 }),
         imagemin.svgo({
            plugins: [
               { removeViewBox: true },
               { cleanupIDs: false }
            ]
         })
      ]))
      .pipe(dest('dist/images'))
}

function scripts() {
   return src([
      'app/js/main.js'
   ])
      .pipe(concat('main.min.js'))
      .pipe(uglify())
      .pipe(dest('app/js'))
      .pipe(browserSync.stream())
}

function styles() {
   return src('app/scss/style.scss')
      .pipe(scss({ outputStyle: 'expanded' }))
      .pipe(autoprefixer({
         overrideBrowserslist: ['last 10 version']
      }))
      .pipe(dest('app/css'))
      .pipe(scss({ outputStyle: 'compressed' }))
      .pipe(concat('style.min.css'))
      .pipe(autoprefixer({
         overrideBrowserslist: ['last 10 version'],
         grid: true
      }))
      .pipe(dest('app/css'))
      .pipe(browserSync.stream())
}

function build() {
   return src([
      'app/css/style.min.css',
      'app/fonts/**/*',
      'app/js/main.min.js',
      'app/*.html'
   ], { base: 'app' })
      .pipe(dest('dist'))
}

function watching() {
   watch(['app/scss/**/*.scss'], styles);
   watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
   watch(['app/*.html']).on('change', browserSync.reload);
}

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = cleanDist;
exports.convertWebp = convertWebp;


exports.build = series(cleanDist, images, convertWebp, build);
exports.default = parallel(styles, browsersync, watching, scripts);

