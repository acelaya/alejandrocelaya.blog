module.exports = function(grunt) {

    var currentTimestamp = new Date().getTime();

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        processhtml: {
            production: {
                files : {
                    'source/_views/default.html.twig' : [ 'source/_views/default.html.twig' ]
                }
            }
        },

        'string-replace': {
            production: {
                options: {
                    replacements: [{
                        pattern: /(.js|.css)\?v/ig,
                        replacement: '$1?v=' + currentTimestamp
                    }]
                },
                files : {
                    'source/_views/default.html.twig': ['source/_views/default.html.twig']
                }
            }
        },

        cssmin : {
            production: {
                files : {
                    'output_prod/assets/css/main.min.css' : [
                        'output_prod/assets/css/animate.css',
                        'output_prod/assets/css/icomoon.css',
                        'output_prod/assets/css/bootstrap.min.css',
                        'output_prod/assets/css/highlight',
                        'output_prod/assets/css/bootstrap-social.css',
                        'output_prod/assets/css/style.css'
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
                    'output_prod/assets/js/main.min.js': [
                        'output_prod/assets/js/jquery.min.js',
                        'output_prod/assets/js/bootstrap.min.js',
                        'output_prod/assets/js/jquery.easing.1.3.js',
                        'output_prod/assets/js/jquery.waypoints.min.js',
                        'output_prod/assets/js/lunr.min.js',
                        'output_prod/assets/js/mustache.js',
                        'output_prod/assets/js/uri.min.js',
                        'output_prod/assets/js/jquery.lunr.search.js',
                        'output_prod/assets/js/highlight.pack.js',
                        'output_prod/assets/js/acelayablog.js',
                        'output_prod/assets/js/main.js'
                    ]
                }
            }
        },

        clean : {
            production : [
                'output_prod/assets/css/animate.css',
                'output_prod/assets/css/icomoon.css',
                'output_prod/assets/css/bootstrap.min.css',
                'output_prod/assets/css/highlight',
                'output_prod/assets/css/bootstrap-social.css',
                'output_prod/assets/css/style.css',
                'output_prod/assets/js/jquery.min.js',
                'output_prod/assets/js/bootstrap.min.js',
                'output_prod/assets/js/jquery.easing.1.3.js',
                'output_prod/assets/js/jquery.waypoints.min.js',
                'output_prod/assets/js/lunr.min.js',
                'output_prod/assets/js/mustache.js',
                'output_prod/assets/js/uri.min.js',
                'output_prod/assets/js/jquery.lunr.search.js',
                'output_prod/assets/js/highlight.pack.js',
                'output_prod/assets/js/acelayablog.js',
                'output_prod/assets/js/main.js'
            ]
        }

    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-string-replace');

    grunt.registerTask('default', ['processhtml:production', 'string-replace:production']);
    grunt.registerTask('postgenerate', ['cssmin', 'uglify', 'clean']);
};
