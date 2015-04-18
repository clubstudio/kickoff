module.exports = function(grunt) {

    grunt.initConfig({

        /* ------------------------------------------------------------------
         * Get project configuration
         * ------------------------------------------------------------------ */

        prj: grunt.file.readJSON('project.json'),

        /* ------------------------------------------------------------------
         * Clear any previously built files before rebuilding assets
         * ------------------------------------------------------------------ */

        clean: {
            dist: [
                '<%= prj.dirs.build.css %>',
                '<%= prj.dirs.build.js %>',
                '<%= prj.dirs.build.img %>',
                '<%= prj.manifest %>'
            ]
        },

        /* ------------------------------------------------------------------
         * Copy any files/assets that can be used 'as is'
         * ------------------------------------------------------------------ */

        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        cwd: '<%= prj.dirs.components %>',
                        src: '<%= prj.copy %>',
                        dest: '<%= prj.dirs.build.js %>/vendor/'
                    }
                ]
            }
        },

        /* ------------------------------------------------------------------
         * Compile SASS into CSS
         * ------------------------------------------------------------------ */

        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= prj.dirs.assets.sass %>',
                    src: ['*.scss'],
                    dest: '<%= prj.dirs.build.css %>',
                    ext: '.css'
                }]
            }
        },

        /* ------------------------------------------------------------------
         * Add vendor prefixes to compiled css
         * ------------------------------------------------------------------ */

        autoprefixer: {
            options: {
                browsers: ['last 2 versions', 'ie 8', 'ie 9']
            },
            dist: {
                src: '<%= prj.dirs.build.css %>/**/*.css'
            }
        },

        /* ------------------------------------------------------------------
         * Minify all CSS files
         * ------------------------------------------------------------------ */

        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            dist: {
                files: [{
                  expand: true,
                  cwd: '<%= prj.dirs.build.css %>',
                  src: ['*.css'],
                  dest: '<%= prj.dirs.build.css %>',
                  ext: '.css'
                }]
            }
        },

        /* ------------------------------------------------------------------
         * Concatenate and minify Javascript
         * ------------------------------------------------------------------ */

        uglify: {
            options: {
                banner: '/*! <%= prj.name %> (<%= grunt.template.today("dd-mm-yyyy HH:MM:ss") %>) */\n'
            },
            dist: {
                files: '<%= prj.js %>'
            }
        },

        /* ------------------------------------------------------------------
         * Add hash to built file names
         * ------------------------------------------------------------------ */

        filerev: {
            options: {
                algorithm: 'md5',
                length: 8
            },
            css: {
                src: '<%= prj.dirs.build.css %>/**/*.css'
            },
            js: {
                src: '<%= prj.dirs.build.js %>/**/*.js'
            },
            images: {
                src: '<%= prj.dirs.build.img %>/**/*.{jpg,jpeg,gif,svg,png,webp}'
            }
        },

        /* ------------------------------------------------------------------
         * Write hashed file names to a manifest file
         * ------------------------------------------------------------------ */

        filerev_assets: {
            dist: {
              options: {
                  dest: '<%= prj.manifest %>',
                  cwd: 'public/'
              }
            }
        },

        /* ------------------------------------------------------------------
         * Update any asset urls in CSS files to their hashed equivalent
         * ------------------------------------------------------------------ */

        cssurlrev: {
            options: {
                assets: '<%= prj.manifest %>'
            },
            files: {
                src: ['<%= prj.dirs.build.css %>/**/*.css'],
            },
        },

        /* ------------------------------------------------------------------
         * Optimise images
         * ------------------------------------------------------------------ */

        imagemin: {
            options: {
                optimizationLevel: 7,
                progressive: true
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= prj.dirs.assets.img %>',
                    src: ['**/*.{png,jpg,gif,svg}'],
                    dest: '<%= prj.dirs.build.img %>'
                }]
            }
        },

        /* ------------------------------------------------------------------
         * Watch for any file changes
         * ------------------------------------------------------------------ */

        watch: {
            assets: {
                files: [
                    '<%= prj.dirs.assets.js %>/**/*.js',
                    '<%= prj.dirs.assets.sass %>/**/*.{scss,sass}',
                    '<%= prj.dirs.assets.img %>/**/*.{png,jpg,gif,svg}'
                ],
                tasks: ['dev']
            },
            livereload: {
                files: [
                    '<%= prj.dirs.templates %>/**/*.php',
                    '<%= prj.dirs.build.css %>/**/*.css',
                    '<%= prj.dirs.build.js %>/**/*.js'
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
     * Cleanup any previously built files
     * ---------------------------------------------------------------------- */

    grunt.registerTask('clean', [], function () {
        grunt.loadNpmTasks('grunt-contrib-clean');

        grunt.task.run('clean');
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
     * Development Task - called by 'watch'
     * ---------------------------------------------------------------------- */

    grunt.registerTask('dev', [], function () {
        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-contrib-copy');
        grunt.loadNpmTasks('grunt-sass');
        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-contrib-imagemin');

        grunt.task.run([
            'clean:dist',
            'copy:dist',
            'sass:dist',
            'uglify:dist',
            'imagemin:dist'
        ]);
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
        grunt.loadNpmTasks('grunt-contrib-imagemin');
        grunt.loadNpmTasks('grunt-filerev');
        grunt.loadNpmTasks('grunt-filerev-assets');
        grunt.loadNpmTasks('grunt-cssurlrev');

        grunt.task.run([
            'clean:dist',
            'copy:dist',
            'sass:dist',
            'autoprefixer:dist',
            'cssmin:dist',
            'uglify:dist',
            'imagemin:dist',
            'filerev',
            'filerev_assets:dist',
            'cssurlrev'
        ]);
    });

}
