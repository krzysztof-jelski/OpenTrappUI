angular
    .module('openTrapp.settings')
    .config(function ($stateProvider) {
        $stateProvider
            .state('config', {
                url: '/config',
                templateUrl: 'configuration.html',
                data: {
                    requiresLogin: true
                }
            });
    });

