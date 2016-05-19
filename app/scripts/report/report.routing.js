angular
    .module('openTrapp.report')
    .config(function ($stateProvider) {
        $stateProvider
            .state('report', {
                url: '/report',
                templateUrl: 'report.html',
                data: {
                    requiresLogin: true
                }
            });
    });

