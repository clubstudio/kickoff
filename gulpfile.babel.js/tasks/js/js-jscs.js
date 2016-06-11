/* --------------------------------------------------------------------------
 * Check JavaScript code style with JSCS
 * -------------------------------------------------------------------------- */

import gulp from 'gulp';
import config from '../../../project.json';

let checkJsCodeStyle, jscs;

checkJsCodeStyle = () => {
    jscs = require('gulp-jscs');

    return gulp.src(config.dirs.assets.js + '/**/*.js')
        .pipe(jscs())
        .pipe(jscs.reporter());
}

gulp.task('js-codestyle', checkJsCodeStyle);
