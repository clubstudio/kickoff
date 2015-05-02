var config     = require('./project.json'),
    gulp       = require('gulp'),
    del        = require('del'),
    sass       = require('gulp-sass')
    prefixer   = require('gulp-autoprefixer'),
    minifyCss  = require('gulp-minify-css'),
    uglify     = require('gulp-uglify'),
    concat     = require('gulp-concat'),
    imagemin   = require('gulp-imagemin'),
    pngquant   = require('imagemin-pngquant'),
    rev        = require('gulp-rev'),
    path       = require('path'),
    revNapkin  = require('gulp-rev-napkin'),
    override   = require('gulp-rev-css-url'),
    sequence   = require('run-sequence'),
    watch      = require('gulp-watch'),
    livereload = require('gulp-livereload');

gulp.task('clean', function () {
    return del([
        config.dirs.build.css,
        config.dirs.build.js,
        config.dirs.build.img,
        config.manifest,
    ]);
});

gulp.task('copy-components', ['clean'], function () {
    return gulp.src(config.components, { cwd: config.dirs.components })
        .pipe(uglify())
        .pipe(gulp.dest(config.dirs.build.js + '/vendor'));
});

gulp.task('sass', ['copy-components'], function () {
    return gulp.src(config.dirs.assets.sass + '/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest(config.dirs.build.css))
        .pipe(livereload());
});

gulp.task('autoprefixer', ['sass'], function () {
    return gulp.src(config.dirs.build.css + '/**/*.css')
        .pipe(prefixer({
             browsers: ['last 2 versions', 'ie 8', 'ie 9']
         }))
        .pipe(gulp.dest(config.dirs.build.css));
});

gulp.task('minify-css', ['sass', 'autoprefixer'], function () {
    return gulp.src(config.dirs.build.css + '/**/*.css')
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest(config.dirs.build.css));
});

gulp.task('uglify', function () {
    for (var key in config.js) {
            gulp.src(config.js[key])
            .pipe(uglify())
            .pipe(concat(key))
            .pipe(gulp.dest(config.dirs.build.js))
            .pipe(livereload());
    }
});

gulp.task('imagemin', ['copy-components'], function () {
    return gulp.src(config.dirs.assets.img + '/**/*')
               .pipe(imagemin({
                   progressive: true,
                   svgoPlugins: [{ removeViewBox: false}],
                   use: [pngquant()]
               }))
               .pipe(gulp.dest(config.dirs.build.img));
});

gulp.task('rev', ['clean', 'copy-components', 'minify-css', 'uglify', 'imagemin'], function () {
    return gulp.src([
            config.dirs.build.css + '/**/*.css',
            config.dirs.build.js + '/**/*.js',
            config.dirs.build.img + '/**/*.{png,jpg,gif,svg}'
        ], { base: path.join(process.cwd(), config.dirs.build.root) })
        .pipe(rev())
        .pipe(override())
        .pipe(gulp.dest(config.dirs.build.root))
        .pipe(revNapkin())
        .pipe(rev.manifest('assets.json'))
        .pipe(gulp.dest(config.dirs.assets.root));
});

gulp.task('templates', function () {
    return gulp.src(config.dirs.templates + '/**/*.{html,twig,php}')
        .pipe(livereload());
});

gulp.task('watch', function () {
    livereload.listen();

	gulp.watch(config.dirs.assets.sass + '/**/*.{scss,sass}', ['sass']);
	gulp.watch(config.dirs.assets.js + '/**/*.js', ['uglify']);
	gulp.watch(config.dirs.assets.img + '/**/*.{png,jpg,gif,svg}', ['imagemin']);
	gulp.watch(config.dirs.templates + '/**/*.{html,twig,php}', ['templates']);
});

gulp.task('build', [
    'clean',
    'copy-components',
    'sass',
    'autoprefixer',
    'minify-css',
    'uglify',
    'rev'
]);

gulp.task('default', ['clean', 'copy-components', 'sass', 'uglify', 'watch']);
