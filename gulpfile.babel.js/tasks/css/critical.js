/* ---------------------------------------------------------------------------
 * Compile SASS into CSS
 * -------------------------------------------------------------------------- */

import gulp from 'gulp';
import config from '../../../project.json';

let critical, criticalCSS;

const loadPlugins = function () {
    critical = require('critical');
};

criticalCSS = (callback) => {
    loadPlugins();

    doSynchronousLoop(config.critical, processCriticalCSS, () => {
        callback();
    });
}

function doSynchronousLoop(data, processData, done) {
    if (data.length > 0) {
        const loop = (data, i, processData, done) => {
            processData(data[i], i, () => {
                if (++i < data.length) {
                    loop(data, i, processData, done);
                } else {
                    done();
                }
            });1
        };
        loop(data, 0, processData, done);
    } else {
        done();
    }
}

function processCriticalCSS(element, i, callback) {
    const criticalSrc = config.url + '/' + element.url;
    const criticalDest = '../' + config.dirs.templates + '/critical-css/' + element.template + '.min.css';

    critical.generate({
        src: criticalSrc,
        dest: criticalDest,
        inline: false,
        ignore: [],
        base: config.dirs.build.root + '/',
        pathPrefix: '/',
        css: config.css,
        minify: true,
        width: 1200,
        height: 1200
    }, (err, output) => {
        callback();
    });
}

gulp.task('css-critical', criticalCSS);
