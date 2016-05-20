angular
    .module('openTrapp.worklog')
    .config(function ($stateProvider) {
        $stateProvider
            .state('registration', {
                url: '/registration',
                templateUrl: 'templates/worklog/registration.html',
                controller: 'RegistrationController',
                data: {
                    requiresLogin: true
                }
            });
    });

