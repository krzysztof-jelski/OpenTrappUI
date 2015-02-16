angular.module('openTrapp')
    .factory('worklogsProvider', function ($http) {

        var worklogs = new Worklogs($http);
console.log('worklogs = ');
console.log(worklogs);
        return worklogs;

    });




