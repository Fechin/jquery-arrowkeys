module.exports = function(grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({

        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
                   '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                   '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
                   '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
                   ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

        // Task configuration.
        clean: {
            src: ['dist']
        },
        uglify: {
            build: {
                src: 'src/<%= pkg.name %>.js',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            files: ['Gruntfile.js', 'src/**/*.js']
        },
        watch: {
            scripts: {
                files: ['**/*.js'],
                tasks: ['jshint', 'uglify'],
                options: {
                    spawn: false,
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task.
    grunt.registerTask('default', ['jshint', 'clean', 'uglify', 'watch']);

};
