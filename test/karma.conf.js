module.exports = function (config) {
    config.set({
        basePath: '../',
        exclude: ['**/bootstrap.js', '**/bootstrap.min.js','**/bootstrap-tagautocomplete.js'],
        frameworks: ['jasmine'],
        files: [
            'app/lib/angular.js',
            'app/lib/*.js',
            'app/scripts/OpenTrappModule.js',
            'app/scripts/*.js',
            'test/lib/*.js',
            'test/**/*.js'
        ],

        browsers: [
            'PhantomJS'
        ],
        autoWatch: false,
        singleRun: true
    });
};
