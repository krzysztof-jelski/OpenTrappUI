module.exports = function (config) {
    config.set({
        basePath: '../',
        exclude: [
            '**/bootstrap.js',
            '**/bootstrap.min.js',
            'app/scripts/AuthInterceptor.js'
        ],
        plugins: [
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-ng-html2js-preprocessor',
            'karma-phantomjs-launcher'
        ],
        frameworks: [
            'jasmine'
        ],
        files: [
            'app/lib/angular.js',
            'app/lib/**/*.js',
            'app/scripts/**/*.module.js',
            'app/scripts/**/*.js',
            'test/lib/**/*.js',
            'test/**/*.js',
            'app/templates/**/*.html'
        ],
        ngHtml2JsPreprocessor: {
            moduleName: 'karma.cached.htmls',
            cacheIdFromPath: function (filepath) {
                return filepath.replace("app/", "");
            }
        },
        preprocessors: {
            'app/templates/**/*.html': ['ng-html2js']
        },
        browsers: [
            'PhantomJS'
        ],
        autoWatch: false,
        singleRun: true
    });
};
