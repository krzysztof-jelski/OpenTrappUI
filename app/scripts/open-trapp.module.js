angular
    .module('openTrapp', [
        /* vendor */
        'ngAnimate',
        'ngRoute',
        'ngCookies',
        /* app */
        'openTrapp.time',
        'openTrapp.settings',
        'openTrapp.employee',
        'openTrapp.projects',
        'openTrapp.worklog',
        'openTrapp.report',
        'openTrapp.authentication',
        'openTrapp.environment'
    ]);
