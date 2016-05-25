angular
    .module('openTrapp')
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'templates/home.html',
                data: {
                    requiresLogin: false
                }
            });
        $urlRouterProvider.otherwise('/');
    })
    .controller('RouterCtrl', function ($location) {
        var self = this;
        self.isActive = function (path) {
            return ($location.path().substr(0, path.length) == path);
        };
    });

