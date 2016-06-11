/* --------------------------------------------------------------------------
 * Clear any previously built files before rebuilding assets
 * -------------------------------------------------------------------------- */

import gulp from 'gulp';
import config from '../../project.json';

let clean;

clean = () => {
    let del = require('del'),
        cleanDirs = Object.keys(config.dirs.build).map((key) => {
            return (key !== 'root') ? config.dirs.build[key] : 'undefined';
        }).concat([config.manifest.path + '/' + config.manifest.filename]);

    return del.sync(cleanDirs);
}

gulp.task('clean', clean);
