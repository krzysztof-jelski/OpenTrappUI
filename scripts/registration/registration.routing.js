angular
    .module('openTrapp.registration')
    .config(function ($stateProvider) {
        $stateProvider
            .state('registration', {
                url: '/registration',
                templateUrl: 'templates/registration/registration.html',
                controller: 'RegistrationController',
                controllerAs: 'registration',
                data: {
                    requiresLogin: true
                }
            });
    });

