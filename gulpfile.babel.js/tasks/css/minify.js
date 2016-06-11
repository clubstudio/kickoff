/* --------------------------------------------------------------------------
 * Minify all CSS files
 * -------------------------------------------------------------------------- */

import gulp from 'gulp';
import config from '../../../project.json';

let minify, cleanCSS;

minify = () => {
    cleanCSS = require('gulp-clean-css');

    return gulp.src(config.dirs.build.css + '/**/*.css')
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest(config.dirs.build.css));
};

gulp.task('css-minify', minify);
