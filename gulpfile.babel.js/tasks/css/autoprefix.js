/* --------------------------------------------------------------------------
 * Add vendor prefixes to compiled CSS
 * -------------------------------------------------------------------------- */

import gulp from 'gulp';
import config from '../../../project.json';

let autoprefix, prefixer;

autoprefix = () => {
    prefixer = require('gulp-autoprefixer');

    return gulp.src(config.dirs.build.css + '/**/*.css')
        .pipe(prefixer({
            browsers: config.browserSupport
        }))
        .pipe(gulp.dest(config.dirs.build.css));
};

gulp.task('css-autoprefix', autoprefix);
