angular
    .module('openTrapp', [
        /* vendor */
        'ngRoute',
        'ngAnimate',
        'ngCookies',
        'ui.bootstrap',
        /* app */
        'openTrapp.time',
        'openTrapp.settings',
        'openTrapp.worklog',
        'openTrapp.report'
    ]);
