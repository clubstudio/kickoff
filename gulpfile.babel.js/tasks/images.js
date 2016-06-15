/* --------------------------------------------------------------------------
 * Optimise images
 * -------------------------------------------------------------------------- */

import gulp from 'gulp';
import config from '../../project.json';

let minifyImages, imagemin;

minifyImages = () => {
    imagemin = require('gulp-imagemin');

    return gulp.src(config.dirs.assets.img + '/**/*')
        .pipe(imagemin([], { verbose: true }))
        .pipe(gulp.dest(config.dirs.build.img));
}

gulp.task('images', minifyImages);
