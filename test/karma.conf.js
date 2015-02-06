module.exports = function (config) {
    config.set({
        basePath: '../',
        exclude: [
            '**/bootstrap.js',
            '**/bootstrap.min.js',
            'app/scripts/AuthInterceptor.js'
        ],
        frameworks: ['jasmine'],
        files: [
            'app/lib/angular.js',
            'app/lib/*.js',
            'app/scripts/OpenTrappModule.js',
            'app/scripts/*.js',
            'test/lib/*.js',
            'test/**/*.js',
            'app/templates/*.html'
        ],
        ngHtml2JsPreprocessor: {
            moduleName: 'karma.cached.htmls',
            cacheIdFromPath: function (filepath) {
                return filepath.replace("app/", "");
            }
        },
        preprocessors: {
            'app/templates/*.html': ['ng-html2js']
        },
        browsers: [
            'PhantomJS'
        ],
        autoWatch: false,
        singleRun: true
    });
};
