angular
    .module('openTrapp.report')
    .config(function ($stateProvider) {
        $stateProvider
            .state('report', {
                url: '/report',
                templateUrl: 'templates/report/report.html',
                controller: 'ReportController',
                data: {
                    requiresLogin: true
                }
            });
    });

