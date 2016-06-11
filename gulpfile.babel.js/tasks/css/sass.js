/* ---------------------------------------------------------------------------
 * Compile SASS into CSS
 * -------------------------------------------------------------------------- */

import gulp from 'gulp';
import config from '../../../project.json';

let compileSass, sourcemaps, livereload, sass;

const loadPlugins = function () {
    sass = require('gulp-sass');
    sourcemaps = require('gulp-sourcemaps');
    livereload = require('gulp-livereload');
};


compileSass = () => {
    loadPlugins();

    return gulp.src(config.dirs.assets.sass + '/**/*.{scss,sass}')
        .pipe(sourcemaps.init())
        .pipe(
            sass({
                outputStyle: 'expanded'
            })
            .on('error', sass.logError)
        )
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.dirs.build.css))
        .pipe(livereload());

}

gulp.task('sass', compileSass);
