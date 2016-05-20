angular
    .module('openTrapp.settings')
    .config(function ($stateProvider) {
        $stateProvider
            .state('config', {
                url: '/config',
                templateUrl: 'templates/settings/settings.html',
                controller: 'SettingsController',
                data: {
                    requiresLogin: true
                }
            });
    });

