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
                    'public/css/project-name.css': 'assets/sass/project-name.scss'
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
                        'assets/js/main.js'
                    ]
                }
            }
        },
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'assets/img/',
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
                files: ['assets/js/*.js'],
                tasks: ['uglify'],
                options: {
                    spawn: false
                }
            },
            sass: {
                files: ['assets/sass/**/*.{scss,sass}'],
                tasks: ['sass'],
                options: {
                    spawn: false
                }
            },
            autoprefixer: {
                files: ['public/css/*.css'],
                tasks: ['autoprefixer'],
                options: {
                    spawn: false
                }
            },
            imagemin: {
                files: ['assets/img/**/*.{png,jpg,gif,svg}'],
                tasks: ['imagemin'],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['copy', 'sass', 'autoprefixer', 'uglify', 'imagemin']);
}
