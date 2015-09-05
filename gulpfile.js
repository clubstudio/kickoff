/* --------------------------------------------------------------------------
 * Get project configuration
 * -------------------------------------------------------------------------- */

var config = require('./project.json');

/* --------------------------------------------------------------------------
 * Require Tasks
 * -------------------------------------------------------------------------- */

var gulp = require('gulp'),
    del = require('del'),
    sass = require('gulp-sass'),
    prefixer = require('gulp-autoprefixer'),
    minifyCss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rev = require('gulp-rev'),
    path = require('path'),
    revNapkin = require('gulp-rev-napkin'),
    override = require('gulp-rev-css-url'),
    sequence = require('run-sequence'),
    watch = require('gulp-watch'),
    livereload = require('gulp-livereload');

/* --------------------------------------------------------------------------
 * Clear any previously built files before rebuilding assets
 * -------------------------------------------------------------------------- */

gulp.task('clean', function () {
    return del.sync([
        config.dirs.build.css,
        config.dirs.build.js,
        config.dirs.build.img,
        config.dirs.build.root + '/fonts',
        config.manifest.path + '/' + config.manifest.filename
    ]);
});

/* --------------------------------------------------------------------------
 * Copy and minify any bower components
 * -------------------------------------------------------------------------- */

gulp.task('copy-components', function () {
    return gulp.src(config.components, {
        cwd: config.dirs.components
    })
    .pipe(uglify())
    .pipe(gulp.dest(config.dirs.build.js + '/vendor'));
});

gulp.task('copy-fonts', function () {
    return gulp.src(config.fonts)
        .pipe(gulp.dest(config.dirs.build.root + '/fonts'));
});

/* ---------------------------------------------------------------------------
 * Compile SASS into CSS
 * -------------------------------------------------------------------------- */

gulp.task('sass', function () {
    return gulp.src(config.dirs.assets.sass + '/**/*.{scss,sass}')
        .pipe(sass())
        .pipe(gulp.dest(config.dirs.build.css))
        .pipe(livereload());
});

/* --------------------------------------------------------------------------
 * Add vendor prefixes to compiled css
 * -------------------------------------------------------------------------- */

gulp.task('autoprefixer', function () {
    return gulp.src(config.dirs.build.css + '/**/*.css')
            .pipe(prefixer({
            browsers: ['last 2 versions', 'ie 8', 'ie 9']
        }))
        .pipe(gulp.dest(config.dirs.build.css));
});

/* --------------------------------------------------------------------------
 * Minify all CSS files
 * -------------------------------------------------------------------------- */

gulp.task('minify-css', function () {
    return gulp.src(config.dirs.build.css + '/**/*.css')
        .pipe(minifyCss({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest(config.dirs.build.css));
});

/* --------------------------------------------------------------------------
 * Concatenate and minify Javascript
 * -------------------------------------------------------------------------- */

gulp.task('uglify', function () {
    for (var key in config.js) {
        gulp.src(config.js[key])
            .pipe(uglify())
            .pipe(concat(key))
            .pipe(gulp.dest(config.dirs.build.js));
    }

    livereload.reload();
});

/* --------------------------------------------------------------------------
 * Optimise images
 * -------------------------------------------------------------------------- */

gulp.task('imagemin', function () {
    return gulp.src(config.dirs.assets.img + '/**/*')
            .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(config.dirs.build.img));
});

/* --------------------------------------------------------------------------
 * Add hash to built file names
 *     1. Rev filenames
 *     2. Override filenames in CSS files
 *     3. Generate assets manifest file
 * -------------------------------------------------------------------------- */

gulp.task('rev', function () {
    return gulp.src(
            [
                config.dirs.build.css + '/**/*.css',
                config.dirs.build.js + '/**/*.js',
                config.dirs.build.img + '/**/*.{png,jpg,gif,svg}'
            ], {
                base: path.join(process.cwd(), config.dirs.build.root)
            }
        )
        .pipe(rev())
        .pipe(override())
        .pipe(gulp.dest(config.dirs.build.root))
        .pipe(revNapkin())
        .pipe(rev.manifest(config.manifest.filename))
        .pipe(gulp.dest(config.dirs.assets.root));
});

/* --------------------------------------------------------------------------
 * Watch for any file changes
 * -------------------------------------------------------------------------- */

gulp.task('watch', function () {
    livereload.listen();

    gulp.watch(config.dirs.assets.sass + '/**/*.{scss,sass}', ['sass']);
    gulp.watch(config.dirs.assets.js + '/**/*.js', ['uglify']);
    gulp.watch(config.dirs.assets.img + '/**/*.{png,jpg,gif,svg}', ['imagemin']);

    gulp.watch(config.dirs.templates + '/**/*.{html,twig,php}').on('change', function (file) {
        livereload.changed(file.path);
    });
});

/* --------------------------------------------------------------------------
 * Build - Builds all assets ready for production
 *     1. Removes any previously built assets
 *     2. Copies any required dependencies
 *     3. Compiles CSS
 *     4. Applies any vendor prefixes
 *     5. Minifies CSS
 *     6. Builds JS files
 *     7. Optimises images
 *     8. Add hashes to asset filenames
 * -------------------------------------------------------------------------- */

gulp.task('build', function () {
    return sequence(
        'clean',
        'copy-components',
        'copy-fonts',
        ['sass', 'imagemin', 'uglify'],
        'autoprefixer',
        'minify-css',
        'rev'
    );
});

/* --------------------------------------------------------------------------
 * Default Task
 *     1. Cleans any previously built assets
 *     2. Copies any required dependencies
 *     3. Builds the development versions of any css, javascript or images
 *     4. Watches for any changes...
 * -------------------------------------------------------------------------- */

gulp.task('default', function () {
    return sequence(
        'clean',
        'copy-components',
        'copy-fonts',
        ['sass', 'uglify', 'imagemin'],
        'watch'
    );
});
