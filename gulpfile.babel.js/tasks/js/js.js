/* --------------------------------------------------------------------------
 * Compile, concatenate and minify JavaScript
 * -------------------------------------------------------------------------- */

import gulp from 'gulp';
import config from '../../../project.json';

let js, sourcemaps, livereload, concat, uglify, babel;

const loadPlugins = () => {
    livereload = require('gulp-livereload');
    sourcemaps = require('gulp-sourcemaps');
    uglify = require('gulp-uglify');
    concat = require('gulp-concat');
    babel = require('gulp-babel');
};

js = () => {
    loadPlugins();

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

    return gulp;
}

gulp.task('js', js);
