/* --------------------------------------------------------------------------
 * Get project configuration
 * -------------------------------------------------------------------------- */

const config = require('./project.json');

/* --------------------------------------------------------------------------
 * Import Required Modules
 * -------------------------------------------------------------------------- */

import del from 'del';
import gulp from 'gulp';
import path from 'path';
import rev from 'gulp-rev';
import jscs from 'gulp-jscs';
import sass from 'gulp-sass';
import watch from 'gulp-watch';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import eslint from 'gulp-eslint';
import uglify from 'gulp-uglify';
import sequence from 'run-sequence';
import imagemin from 'gulp-imagemin';
import sassLint from 'gulp-sass-lint';
import cleanCSS from 'gulp-clean-css';
import revNapkin from 'gulp-rev-napkin';
import revCssUrl from 'gulp-rev-css-url';
import prefixer from 'gulp-autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import pngquant from 'imagemin-pngquant';
import livereload from 'gulp-livereload';

/* --------------------------------------------------------------------------
 * Clear any previously built files before rebuilding assets
 * -------------------------------------------------------------------------- */

gulp.task('clean', () => {
    return del.sync([
        config.dirs.build.css,
        config.dirs.build.js,
        config.dirs.build.img,
        config.manifest.path + '/' + config.manifest.filename
    ]);
});

/* --------------------------------------------------------------------------
 * Copy any components
 * -------------------------------------------------------------------------- */

gulp.task('copy-components', () => {
    for (let directory in config.components) {
        gulp.src(config.components[directory])
            .pipe(gulp.dest(config.dirs.build.root + '/' + directory));
    }
});

/* ---------------------------------------------------------------------------
 * Compile SASS into CSS
 * -------------------------------------------------------------------------- */

gulp.task('sass', () => {
    return gulp.src(config.dirs.assets.sass + '/**/*.{scss,sass}')
        .pipe(sassLint({
            options: {
                configFile: '.sass-lint.yml'
            }
        }))
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
        .pipe(sourcemaps.init())
        .pipe(
            sass({
                outputStyle: 'expanded'
            })
            .on('error', sass.logError)
        )
        .pipe(prefixer({
            browsers: config.browserSupport
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.dirs.build.css))
        .pipe(livereload());
});

/* --------------------------------------------------------------------------
 * Add vendor prefixes to compiled CSS
 * -------------------------------------------------------------------------- */

gulp.task('autoprefix', () => {
    return gulp.src(config.dirs.build.css + '/**/*.css')
        .pipe(prefixer({
            browsers: config.browserSupport
        }))
        .pipe(gulp.dest(config.dirs.build.css));
});

/* --------------------------------------------------------------------------
 * Minify all CSS files
 * -------------------------------------------------------------------------- */

gulp.task('minify-css', () => {
    return gulp.src(config.dirs.build.css + '/**/*.css')
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest(config.dirs.build.css));
});

/* --------------------------------------------------------------------------
 * Lint JavaScript with ESLint
 * -------------------------------------------------------------------------- */

gulp.task('eslint', () => {
    return gulp.src([config.dirs.assets.js + '/**/*.js'])
               .pipe(eslint({
                   options: {
                       useEslintrc: true
                   }
               }))
               .pipe(eslint.format())
               .pipe(eslint.failAfterError());
});

/* --------------------------------------------------------------------------
 * Check JavaScript code style with JSCS
 * -------------------------------------------------------------------------- */

gulp.task('jscs', () => {
    return gulp.src(config.dirs.assets.js + '/**/*.js')
               .pipe(jscs({ fix: true }))
               .pipe(jscs.reporter())
               .pipe(gulp.dest(config.dirs.assets.js));
});

/* --------------------------------------------------------------------------
 * Compile, concatenate and minify JavaScript
 * -------------------------------------------------------------------------- */

gulp.task('js', () => {
    for (let key in config.js) {
        gulp.src(config.js[key])
            .pipe(sourcemaps.init())
            .pipe(babel())
            .pipe(
                uglify().on('error', (error) => {
                    console.log(error.message + ' on ' + error.lineNumber);
                })
            )
            .pipe(concat(key))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(config.dirs.build.js));
    }

    livereload.reload();
});

/* --------------------------------------------------------------------------
 * Optimise images
 * -------------------------------------------------------------------------- */

gulp.task('imagemin', () => {
    return gulp.src(config.dirs.assets.img + '/**/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [
                pngquant()
            ]
        }))
        .pipe(gulp.dest(config.dirs.build.img));
});

/* --------------------------------------------------------------------------
 * Add hash to built file names
 *     1. Rev filenames
 *     2. Override filenames in CSS files
 *     3. Generate assets manifest file
 * -------------------------------------------------------------------------- */

gulp.task('rev', () => {
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
        .pipe(revCssUrl())
        .pipe(gulp.dest(config.dirs.build.root))
        .pipe(revNapkin())
        .pipe(rev.manifest(config.manifest.filename))
        .pipe(gulp.dest(config.dirs.assets.root));
});

/* --------------------------------------------------------------------------
 * Watch for any file changes
 * -------------------------------------------------------------------------- */

gulp.task('watch', () => {
    let options = { usePolling: true };

    livereload.listen();

    watch(config.dirs.assets.sass + '/**/*.{scss,sass}', options, () => {
        gulp.start('sass');
    });

    watch(config.dirs.assets.js + '/**/*.js', options, () => {
        gulp.start(['eslint', 'jscs', 'js']);
    });

    watch(config.dirs.assets.img + '/**/*.{png,jpg,gif,svg}', options, () => {
        gulp.start('imagemin');
    });

    watch(config.dirs.templates + '/**/*.{html,twig,php}', options, (a) => {
        livereload.changed(a);
    });
});

/* --------------------------------------------------------------------------
 * Dev Task
 *     1. Removes any previously built assets
 *     2. Copies files/directories
 *     3. Compiles CSS
 *     4. Builds JS files
 * -------------------------------------------------------------------------- */

gulp.task('dev', () => {
    return sequence(
        'clean',
        'copy-components',
        ['sass', 'imagemin', 'eslint', 'jscs', 'js']
    );
});

/* --------------------------------------------------------------------------
 * Build - Builds all assets ready for production
 *     1. Removes any previously built assets
 *     2. Copies files/directories
 *     3. Compiles CSS
 *     4. Applies any vendor prefixes
 *     5. Minifies CSS
 *     6. Builds JS files
 *     7. Optimises images
 *     8. Add hashes to asset filenames
 * -------------------------------------------------------------------------- */

gulp.task('build', () => {
    return sequence(
        'clean',
        'copy-components',
        ['sass', 'imagemin', 'eslint', 'jscs', 'js'],
        'autoprefix',
        'minify-css',
        'rev'
    );
});

/* --------------------------------------------------------------------------
 * Default Task
 *     1. Cleans any previously built assets
 *     2. Copies any required dependencies
 *     3. Builds the development versions of any CSS, JavaScript or images
 *     4. Watches for any changes...
 * -------------------------------------------------------------------------- */

gulp.task('default', () => {
    return sequence(
        'dev',
        'watch'
    );
});
