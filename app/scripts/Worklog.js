angular.module('openTrapp').factory('worklog', function ($http) {

    return new Worklog($http);
	
});


