/* --------------------------------------------------------------------------
 * Import Modules
 * -------------------------------------------------------------------------- */

import gulp from 'gulp';
import sequence from 'run-sequence';
import requireDir from 'require-dir';
import args from 'yargs';

/* --------------------------------------------------------------------------
 * Import Tasks
 * -------------------------------------------------------------------------- */

requireDir('./tasks', { recurse: true });

/* --------------------------------------------------------------------------
 * Dev Task
 *     1. Removes any previously built assets
 *     2. Copies files/directories
 *     3. Compiles CSS
 *     4. Builds JS files
 * -------------------------------------------------------------------------- */

gulp.task('default', () => {
    if (args.argv.compileTemplates) {
        sequence('compile-templates');
    }

    return sequence(
        'clean',
        ['copy-components', 'images'],
        'sass-lint',
        'sass',
        'js-lint',
        'js'
    );
});

/* --------------------------------------------------------------------------
 * Production - Builds all assets ready for production
 *     1. Removes any previously built assets
 *     2. Copies files/directories
 *     3. Compiles CSS
 *     4. Applies any vendor prefixes
 *     5. Minifies CSS
 *     6. Extracts Critical CSS
 *     7. Builds JS files
 *     8. Optimises images
 *     9. Add hashes to asset filenames
 * -------------------------------------------------------------------------- */

gulp.task('production', () => {
    if (args.argv.compileTemplates) {
        sequence('compile-templates');
    }

    return sequence(
        'clean',
        ['copy-components', 'images'],
        'sass-lint',
        'sass',
        'css-autoprefix',
        'css-minify',
        'css-critical',
        'js-lint',
        'js',
        'rev'
    );
});

/* --------------------------------------------------------------------------
 * Watch
 *     1. Runs `dev` task (gulp/tasks/dev.js)
 *     4. Watches for any changes...
 * -------------------------------------------------------------------------- */

gulp.task('watch', () => {
    return sequence('default', 'watcher');
});

