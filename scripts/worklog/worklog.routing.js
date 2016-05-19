angular
    .module('openTrapp.worklog')
    .config(function ($stateProvider) {
        $stateProvider
            .state('registration', {
                url: '/registration',
                templateUrl: 'registration.html',
                data: {
                    requiresLogin: true
                }
            });
    });

