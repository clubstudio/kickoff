/* --------------------------------------------------------------------------
 * Watch for any file changes
 * -------------------------------------------------------------------------- */

import gulp from 'gulp';
import config from '../../project.json';

let watchForChanges, livereload, sequence, watch;

const loadPlugins = () => {
    livereload = require('gulp-livereload');
    sequence = require('run-sequence');
    watch = require('gulp-watch');
};

watchForChanges = () => {
    let options = { usePolling: true };

    loadPlugins();

    livereload.listen();

    watch(config.dirs.assets.sass + '/**/*.{scss,sass}', options, () => {
        return sequence(['sass-lint'], 'sass');
    });

    watch(config.dirs.assets.js + '/**/*.js', options, () => {
        return sequence(['js-lint', 'js-codestyle'], 'js');
    });

    watch(config.dirs.assets.img + '/**/*.{png,jpg,gif,svg}', options, () => {
        gulp.start('images');
    });

    watch(config.dirs.templates + '/**/*.{html,twig,php}', options, (a) => {
        livereload.changed(a);
    });
}

gulp.task('watch', watchForChanges);
