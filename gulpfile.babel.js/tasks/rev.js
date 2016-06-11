/* --------------------------------------------------------------------------
 * Add hash to built file names
 *     1. Rev filenames
 *     2. Override filenames in CSS files
 *     3. Generate assets manifest file
 * -------------------------------------------------------------------------- */

import gulp from 'gulp';
import config from '../../project.json';

let rev, path, revCssUrl, revNapkin, revStaticAssets;

const loadPlugins = () => {
    path = require('path');
    rev = require('gulp-rev');
    revNapkin = require('gulp-rev-napkin');
    revCssUrl = require('gulp-rev-css-url');
};

revStaticAssets = () => {
    loadPlugins();

    return gulp.src(
            [
                config.dirs.build.img + '/**/*.{png,jpg,gif,svg}',
                config.dirs.build.css + '/**/*.css',
                config.dirs.build.js + '/**/*.js'
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
}

gulp.task('rev', revStaticAssets);
