/* --------------------------------------------------------------------------
 * Import Modules
 * -------------------------------------------------------------------------- */

import gulp from 'gulp';
import sequence from 'run-sequence';
import requireDir from 'require-dir';

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

gulp.task('dev', () => {
    return sequence(
        'clean',
        ['copy-components', 'images'],
        // 'sass-lint',
        'sass',
        ['js-lint', 'js-codestyle'],
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
 *     6. Builds JS files
 *     7. Optimises images
 *     8. Add hashes to asset filenames
 * -------------------------------------------------------------------------- */

gulp.task('production', () => {
    return sequence(
        'clean',
        ['copy-components', 'images'],
        'sass-lint',
        'sass',
        'css-autoprefix',
        'css-minify',
        ['js-lint', 'js-codestyle'],
        'js',
        'rev'
    );
});

/* --------------------------------------------------------------------------
 * Default Task
 *     1. Runs `dev` task (gulp/tasks/dev.js)
 *     4. Watches for any changes...
 * -------------------------------------------------------------------------- */

gulp.task('default', () => {
    return sequence('dev', 'watch');
});
