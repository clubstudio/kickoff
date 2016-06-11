
/* --------------------------------------------------------------------------
 * Lint JavaScript with ESLint
 * -------------------------------------------------------------------------- */

import gulp from 'gulp';
import config from '../../../project.json';

let lintJs, eslint;

lintJs = () => {
    eslint = require('gulp-eslint');

    return gulp.src([config.dirs.assets.js + '/**/*.js'])
        .pipe(eslint({
            options: {
                useEslintrc: true
            }
        }))
        .pipe(eslint.format());
       // .pipe(eslint.failAfterError());
}

gulp.task('js-lint', lintJs);
