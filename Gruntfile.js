'use strict';

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/* \n * <%= pkg.name %> <%= pkg.version %>\n * <%= pkg.homepage %>\n * \n * Licensed under the <%= pkg.license %> license\n */',
        uglify: {
            production: {
                src: [ 'src/html.sortable.js' ],
                dest: 'dist/html.sortable.min.<%= pkg.version %>.js'
            },
            'production-angular': {
                src: [ 'src/html.sortable.angular.js' ],
                dest: 'dist/html.sortable.angular.min.<%= pkg.version %>.js'
            }
        },
        copy: {
            production: {
                files: [
                    { src: 'src/html.sortable.js', dest: 'dist/html.sortable.<%= pkg.version %>.js' },
                    { src: 'src/html.sortable.angular.js', dest: 'dist/html.sortable.angular.<%= pkg.version %>.js' }
                ]
            }
        },
        clean: {
            dist: 'dist/*'
        },
        eslint: {
            options: {
                config: 'eslint.json'
            },
            target: ['src/*.js']
        }
    });

    grunt.registerTask('default', ['build']);
    grunt.registerTask('validate', ['eslint']);
    grunt.registerTask('build', ['clean', 'validate', 'copy', 'uglify']);
};
