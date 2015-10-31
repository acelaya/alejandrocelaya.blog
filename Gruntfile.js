module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        // Replace development by production elements
        processhtml: {
            production: {
                files : {
                    'source/_views/default.html.twig' : [ 'source/_views/default.html.twig' ]
                }
            }
        },

        // Minify CSS
        cssmin : {
            minify: {
                expand: true,
                src: [
                    'output_prod/assets/css/bootstrap-social.css',
                    'output_prod/assets/css/main.css'
                ],
                ext: '.min.css'
            },
            combine: {
                files : {
                    'output_prod/assets/css/main.min.css' : [
                        'output_prod/assets/css/bootstrap.min.css',
                        'output_prod/assets/css/bootstrap-social.min.css',
                        'output_prod/assets/css/highlightjs-github.min.css',
                        'output_prod/assets/css/main.min.css'
                    ]
                }
            }
        },

        // Minify javascript with UglifyJS
        uglify : {
            production : {
                src : [
                    'output_prod/assets/js/mustache.js',
                    'output_prod/assets/js/jquery.lunr.search.js',
                    'output_prod/assets/js/acelayablog.js',
                    'output_prod/assets/js/main.js'
                ],
                dest : 'output_prod/assets/js/main.min.js'
            }
        },

        // Concat minified JS files
        concat: {
            options: {
                separator: ';\n'
            },
            production: {
                src: [
                    'output_prod/assets/js/lunr.min.js',
                    'output_prod/assets/js/uri.min.js',
                    'output_prod/assets/js/highlight.pack.js',
                    'output_prod/assets/js/main.min.js'
                ],
                dest: 'output_prod/assets/js/main.min.js'
            }
        },

        // Clean assets outside of main files
        clean : {
            production : [
                'output_prod/assets/css/main.css',
                'output_prod/assets/css/bootstrap-social.css',
                'output_prod/assets/css/bootstrap-social.min.css',
                'output_prod/assets/js/mustache.js',
                'output_prod/assets/js/jquery.lunr.search.js',
                'output_prod/assets/js/acelayablog.js',
                'output_prod/assets/js/main.js',
                'output_prod/assets/js/lunr.min.js',
                'output_prod/assets/js/uri.min.js',
                'output_prod/assets/js/highlight.pack.js'
            ]
        }

    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-processhtml');

    grunt.registerTask('default', ['processhtml:production']);
    grunt.registerTask('postgenerate', ['cssmin', 'uglify', 'concat', 'clean']);
};
