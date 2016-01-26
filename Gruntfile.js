module.exports = function (grunt) {

    const libPath = 'app/lib';

    grunt.initConfig({
        bower: {
            dev: {
                dest: libPath,
                css_dest: libPath + '/css',
                options: {
                    stripAffix: true,
                    packageSpecific: {
                        'angular-mocks': {
                            dest: 'test/lib',
                            files: [
                                'angular-mocks.js'
                            ]
                        },
                        bootstrap: {
                            dest: libPath + '/fonts',
                            js_dest: libPath,
                            files: [
                                'dist/fonts/glyphicons-halflings-regular.eot',
                                'dist/fonts/glyphicons-halflings-regular.woff',
                                'dist/fonts/glyphicons-halflings-regular.woff2',
                                'dist/fonts/glyphicons-halflings-regular.ttf',
                                'dist/css/bootstrap-theme.css',
                                'dist/css/bootstrap.css'
                            ]
                        }
                    }
                }
            }
        },
        karma: {
            unit: {
                configFile: 'test/karma.conf.js'
            },
            dev: {
                configFile: 'test/karma.conf.js',
                singleRun: false,
                autoWatch: true
            }
        },
        'http-server': {
            'dev': {
                root: 'app',

                port: 8081,
                host: "127.0.0.1",

                showDir: false,
                autoIndex: false,
                defaultExt: "html",

                runInBackground: false
            }
        },
        'gh-pages': {
            options: {
                base: 'app',
                message: 'Publish to github pages from grunt'
            },
            'prod': {
                options: {
                    repo: 'git@github.com:Pragmatists/OpenTrappUI.git'
                },
                src: '**/*'
            },
            'dev-mpi': {
                options: {
                    repo: 'git@github.com:mpi/OpenTrappUI.git'
                },
                src: '**/*'
            }
        },
        'exec': {
            generate_parser: {
                cmd: function () {
                    var path = require('path');
                    var pegjs = "node_modules" + path.sep + ".bin" + path.sep + "pegjs";
                    var parserVar = "-e PegWorkLogEntryParser";
                    var inputGrammar = "WorkLogEntryGrammar.pegjs";
                    var outputParser = "app" + path.sep + "lib" + path.sep + "PegWorkLogEntryParser.js";
                    return pegjs + " " + parserVar + " " + inputGrammar + " " + outputParser;
                }
            }
        }
    });

    grunt.registerTask('cleanLib', function () {
        var rimraf = require('rimraf');
        var done = this.async();
        rimraf(libPath, function () {
            grunt.log.writeln('Directory ' + libPath + ' removed.');
            done();
        });
    });

    grunt.loadNpmTasks('grunt-bower');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-http-server');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('default', ['cleanLib', 'bower', 'exec:generate_parser', 'karma:unit']);

    grunt.registerTask('server', ["default", 'http-server:dev']);
};
