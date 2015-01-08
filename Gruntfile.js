module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        cwd: 'vendor/bower_components/',
                        src: [
                            'jquery/dist/jquery.min.js',
                            'html5shiv/dist/html5shiv.min.js'
                        ],
                        dest: 'public/js/vendor/'
                    }
                ]
            }
        },
        sass: {
            dist: {
                options: {
                    outputStyle: 'compressed'
                },
                files: {
                    'public/css/project-name.css': 'resources/assets/sass/project-name.scss'
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 2 versions', 'ie 8', 'ie 9']
            },
            no_dest: {
                src: 'public/css/**/*.css'
            }
        },
        cacheBust: {
            options: {
                baseDir: 'public/',
                encoding: 'utf8',
                algorithm: 'md5',
                length: 16,
                rename: false,
                enableUrlFragmentHint: true
            },
            assets: {
                files: [{
                    src: [
                        'index.html'
                    ]
                }]
            }
        },
        uglify: {
            my_target: {
                files: {
                    'public/js/main.min.js': [
                        'resources/assets/js/main.js'
                    ]
                }
            }
        },
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'resources/assets/img/',
                    src: ['**/*.{png,jpg,gif,svg}'],
                    dest: 'public/img/'
                }]
            },
            options: {
                cache: false,
                optimizationLevel: 7,
                progressive: true
            }
        },
        watch: {
            options: {
                livereload: true
            },
            uglify: {
                files: ['resources/assets/js/**/*.js'],
                tasks: ['js'],
                options: {
                    spawn: false
                }
            },
            sass: {
                files: ['resources/assets/sass/**/*.{scss,sass}'],
                tasks: ['css'],
                options: {
                    spawn: false
                }
            },
            imagemin: {
                files: ['resources/assets/img/**/*.{png,jpg,gif,svg}'],
                tasks: ['images'],
                options: {
                    spawn: false
                }
            }
        }
    });

    /* ======================================================================
     * Tasks Registration
     * ====================================================================== */

    /* ----------------------------------------------------------------------
     * Default Task - Runs Watcher
     * ---------------------------------------------------------------------- */

    grunt.registerTask('default', [], function () {
        grunt.loadNpmTasks('grunt-contrib-watch');

        grunt.task.run('watch');
    });

    /* ----------------------------------------------------------------------
     * Compile SASS and auto-prefix vendor prefixes
     * ---------------------------------------------------------------------- */

    grunt.registerTask('css', [], function () {
        grunt.loadNpmTasks('grunt-sass');
        grunt.loadNpmTasks('grunt-autoprefixer');

        grunt.task.run('sass', 'autoprefixer');
    });

    /* ----------------------------------------------------------------------
     * Javascript
     * ---------------------------------------------------------------------- */

    grunt.registerTask('js', [], function () {
        grunt.loadNpmTasks('grunt-uglify');

        grunt.task.run('uglify');
    });

    /* ----------------------------------------------------------------------
     * Compress Images
     * ---------------------------------------------------------------------- */

    grunt.registerTask('images', [], function () {
        grunt.loadNpmTasks('grunt-contrib-imagemin');

        grunt.task.run('imagemin');
    });

    /* ----------------------------------------------------------------------
     * Build - Runs all tasks
     * ---------------------------------------------------------------------- */

    grunt.registerTask('build', [], function () {
        grunt.loadNpmTasks('grunt-contrib-copy');
        grunt.loadNpmTasks('grunt-sass');
        grunt.loadNpmTasks('grunt-autoprefixer');
        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-contrib-imagemin');

        grunt.task.run('copy', 'sass', 'autoprefixer', 'uglify', 'imagemin');
    });

}
