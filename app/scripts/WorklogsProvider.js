angular.module('openTrapp')
    .factory('worklogsProvider', function ($http) {

        var worklogs = new Worklogs($http);

        return worklogs;

    });




