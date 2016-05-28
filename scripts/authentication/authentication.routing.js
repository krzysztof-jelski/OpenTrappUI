angular
    .module('openTrapp.authentication')
    .config(function ($stateProvider) {
        $stateProvider
            .state('authFailed', {
                url: '/authFailed',
                templateUrl: 'auth-failed.html',
                data: {
                    requiresLogin: false
                }
            })
            .state('authToken', {
                url: '/authToken/:authToken',
                data: {
                    requiresLogin: false
                },
                reloadOnSearch: true,
                controller: 'AuthenticationController'
            });
    });

