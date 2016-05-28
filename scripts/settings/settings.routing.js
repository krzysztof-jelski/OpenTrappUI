angular
    .module('openTrapp.settings')
    .config(function ($stateProvider) {
        $stateProvider
            .state('config', {
                url: '/config',
                templateUrl: 'templates/settings/settings.html',
                controller: 'SettingsController',
                controllerAs: 'settings',
                data: {
                    requiresLogin: true
                }
            });
    });

