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
    });

