angular
    .module('openTrapp', [
        /* vendor */
        'ui.router',
        'ngAnimate',
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
