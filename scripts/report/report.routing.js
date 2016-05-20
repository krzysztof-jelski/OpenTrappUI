angular
    .module('openTrapp.report')
    .config(function ($stateProvider) {
        $stateProvider
            .state('report', {
                abstract: true,
                url: '/report',
                templateUrl: 'templates/report/report.html',
                controller: 'ReportController'
            })
            .state('report.calendar', {
                url: '/calendar',
                templateUrl: 'templates/report/calendar-report.html',
                data: {
                    requiresLogin: true,
                    reportType: 'calendar'
                }
            })
            .state('report.table', {
                url: '/table',
                templateUrl: 'templates/report/table-report.html',
                data: {
                    requiresLogin: true,
                    reportType: 'table'
                }
            })
            .state('report.percentage', {
                url: '/percentage',
                templateUrl: 'templates/report/percentage-report.html',
                data: {
                    requiresLogin: true,
                    reportType: 'percentage'
                }
            });
    });

