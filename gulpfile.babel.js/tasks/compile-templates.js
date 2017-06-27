/* --------------------------------------------------------------------------
 * Watch for any file changes
 * -------------------------------------------------------------------------- */

import gulp from 'gulp';
import config from '../../project.json';

let compileTemplates, args, twig;

const loadPlugins = () => {
    args = require('yargs').argv;
    twig = require('gulp-twig');
};

compileTemplates = () => {
    loadPlugins();

    gulp.src([config.dirs.templates + '/**/*.html', '!' + config.dirs.templates + '/_**/*'])
        .pipe(twig({
            base: 'resources/templates/',
            errorLogToConsole: true
        }))
        .pipe(gulp.dest('public'));
}

gulp.task('compile-templates', compileTemplates);
