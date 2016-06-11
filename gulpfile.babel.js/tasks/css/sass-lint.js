
import gulp from 'gulp';
import config from '../../../project.json';

let lintSass, sassLint;

lintSass = () => {
    sassLint = require ('gulp-sass-lint');

    return gulp.src(config.dirs.assets.sass + '/**/*.{scss,sass}')
        .pipe(sassLint({
            options: {
                configFile: '.sass-lint.yml'
            }
        }))
        .pipe(sassLint.format());
        // .pipe(sassLint.failOnError());
}

gulp.task('sass-lint', lintSass);
