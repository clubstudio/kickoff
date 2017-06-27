/* --------------------------------------------------------------------------
 * Watch for any file changes
 * -------------------------------------------------------------------------- */

import gulp from 'gulp';
import config from '../../project.json';

let watchForChanges, livereload, sequence, watch, args, twig;

const loadPlugins = () => {
    livereload = require('gulp-livereload');
    sequence = require('run-sequence');
    watch = require('gulp-watch');
    args = require('yargs').argv;
    twig = require('gulp-twig');
};

watchForChanges = () => {
    let options = { usePolling: true };

    loadPlugins();

    livereload.listen();

    watch(config.dirs.assets.sass + '/**/*.{scss,sass}', options, () => {
        return sequence(['sass-lint'], 'sass');
    });

    watch(config.dirs.assets.js + '/**/*.js', options, () => {
        return sequence('js-lint', 'js');
    });

    watch(config.dirs.assets.img + '/**/*.{png,jpg,gif,svg}', options, () => {
        gulp.start('images');
    });

    watch(config.dirs.templates + '/**/*.{html,twig,php}', options, (a) => {
        if (args.env === 'twig') {
            gulp.src([config.dirs.templates + '/**/*.html', '!' + config.dirs.templates + '/_**/*'])
                .pipe(twig({
                    base: 'resources/templates/',
                    errorLogToConsole: true
                }))
                .pipe(gulp.dest('public'));
        }

        livereload.changed(a);
    });
}

gulp.task('watch', watchForChanges);
