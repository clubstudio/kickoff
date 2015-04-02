module.exports = function(grunt) {

    grunt.initConfig({
        package: grunt.file.readJSON('package.json'),
        project: {
            name: 'project-name',
            manifest: 'resources/assets/assets.json'
        },
        dirs: {
            components: 'vendor/bower_components',
            assets: {
                sass: 'resources/assets/sass',
                img: 'resources/assets/img',
                js: 'resources/assets/js',
            },
            templates: 'resources/views',
            build: {
                css: 'public/css',
                js: 'public/js',
                img: 'public/img'
            }
        },
        clean: ['public/css', 'public/js', 'public/img'],
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        cwd: '<%= dirs.components %>',
                        src: [
                            'jquery/dist/jquery.min.js',
                            'html5shiv/dist/html5shiv.min.js',
                            'respond-minmax/dest/respond.min.js'
                        ],
                        dest: '<%= dirs.build.js %>/vendor/'
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
                    '<%= dirs.build.css %>/<%= project.name %>.css': '<%= dirs.assets.sass %>/<%= project.name %>.scss'
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 2 versions', 'ie 8', 'ie 9']
            },
            no_dest: {
                src: '<%= dirs.build.css %>/**/*.css'
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: [{
                  expand: true,
                  cwd: '<%= dirs.build.css %>',
                  src: ['*.css'],
                  dest: '<%= dirs.build.css %>',
                  ext: '.css'
                }]
            }
        },
        uglify: {
            my_target: {
                files: {
                    '<%= dirs.build.js %>/main.js': [
                        '<%= dirs.assets.js %>/main.js'
                    ]
                }
            }
        },
        filerev: {
            options: {
                algorithm: 'md5',
                length: 8
            },
            css: {
                src: '<%= dirs.build.css %>/**/*.css'
            },
            js: {
                src: '<%= dirs.build.js %>/**/*.js'
            },
            images: {
                src: '<%= dirs.build.img %>/**/*.{jpg,jpeg,gif,svg,png,webp}'
            }
        },
        filerev_assets: {
            dist: {
              options: {
                  dest: '<%= project.manifest %>',
                  cwd: 'public/'
              }
            }
        },
        cssurlrev: {
            options: {
                assets: '<%= project.manifest %>'
            },
            files: {
                src: ['<%= dirs.build.css %>/**/*.css'],
            },
        },
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: '<%= dirs.assets.img %>',
                    src: ['**/*.{png,jpg,gif,svg}'],
                    dest: '<%= dirs.build.img %>'
                }]
            },
            options: {
                cache: false,
                optimizationLevel: 7,
                progressive: true
            }
        },
        watch: {
            assets: {
                files: [
                    '<%= dirs.assets.js %>/**/*.js',
                    '<%= dirs.assets.sass %>/**/*.{scss,sass}',
                    '<%= dirs.assets.img %>/**/*.{png,jpg,gif,svg}'
                ],
                tasks: ['build']
            },
            livereload: {
                files: [
                    '<%= dirs.templates %>/**/*.php',
                    '<%= dirs.build.css %>/**/*.css',
                    '<%= dirs.build.js %>/**/*.js'
                ],
                options: {
                    livereload: true
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
        grunt.loadNpmTasks('grunt-contrib-cssmin');

        grunt.task.run('sass', 'autoprefixer', 'cssmin');
    });

    /* ----------------------------------------------------------------------
     * Javascript
     * ---------------------------------------------------------------------- */

    grunt.registerTask('js', [], function () {
        grunt.loadNpmTasks('grunt-contrib-uglify');

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
        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-contrib-copy');
        grunt.loadNpmTasks('grunt-sass');
        grunt.loadNpmTasks('grunt-autoprefixer');
        grunt.loadNpmTasks('grunt-contrib-cssmin');
        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-filerev');
        grunt.loadNpmTasks('grunt-filerev-assets');
        grunt.loadNpmTasks('grunt-cssurlrev');
        grunt.loadNpmTasks('grunt-contrib-imagemin');

        grunt.task.run([
            'clean',
            'copy',
            'sass',
            'autoprefixer',
            'cssmin',
            'uglify',
            'imagemin',
            'filerev',
            'filerev_assets',
            'cssurlrev'
        ]);
    });

}
