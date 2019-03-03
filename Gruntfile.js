module.exports = grunt => {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        cssmin : {
            production: {
                files : {
                    'build/assets/css/main.min.css' : [
                        'build/assets/css/animate.css',
                        'build/assets/css/icomoon.css',
                        'build/assets/css/bootstrap.min.css',
                        'build/assets/css/bootstrap-social.css',
                        'build/assets/css/highlightjs-github.min.css',
                        'build/assets/css/style.css'
                    ]
                }
            }
        },

        uglify : {
            options: {
                compress: {
                    drop_console: true
                }
            },
            production : {
                files: {
                    'build/assets/js/main.min.js': [
                        'build/assets/js/jquery.min.js',
                        'build/assets/js/bootstrap.min.js',
                        'build/assets/js/jquery.easing.1.3.js',
                        'build/assets/js/jquery.waypoints.min.js',
                        'build/assets/js/lunr.min.js',
                        'build/assets/js/mustache.js',
                        'build/assets/js/uri.min.js',
                        'build/assets/js/jquery.lunr.search.js',
                        'build/assets/js/highlight.pack.js',
                        'build/assets/js/acelayablog.js',
                        'build/assets/js/main.js'
                    ]
                }
            }
        },

        clean : {
            production : [
                'build/assets/css/animate.css',
                'build/assets/css/icomoon.css',
                'build/assets/css/bootstrap.min.css',
                'build/assets/css/highlightjs-github.min.css',
                'build/assets/css/bootstrap-social.css',
                'build/assets/css/style.css',
                'build/assets/js/jquery.min.js',
                'build/assets/js/bootstrap.min.js',
                'build/assets/js/jquery.easing.1.3.js',
                'build/assets/js/jquery.waypoints.min.js',
                'build/assets/js/lunr.min.js',
                'build/assets/js/mustache.js',
                'build/assets/js/uri.min.js',
                'build/assets/js/jquery.lunr.search.js',
                'build/assets/js/highlight.pack.js',
                'build/assets/js/acelayablog.js',
                'build/assets/js/main.js'
            ]
        },

        htmlmin: {
            production: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand: true,
                    cwd: 'build',
                    src: ['*.html', '**/*.html', '!404.html'],
                    dest: 'build'
                }]
            }
        }

    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ['cssmin', 'uglify', 'clean']);
};
