/* --------------------------------------------------------------------------
 * Copy any components
 * -------------------------------------------------------------------------- */

import gulp from 'gulp';
import config from '../../project.json';

let copyComponents = () => {
    for (let directory in config.components) {
        gulp.src(config.components[directory])
            .pipe(gulp.dest(config.dirs.build.root + '/' + directory));
    }

    return gulp;
}

gulp.task('copy-components', copyComponents);
