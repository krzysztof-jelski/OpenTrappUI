var openTrapp = angular.module('openTrapp'); 

openTrapp
	.controller('ReportFiltersCtrl', function ($scope, $http, $timeout, worklog, currentMonth, currentEmployee) {
	
		$scope.worklog = worklog;
		$scope.months = [];

		$scope.init = function() {

            worklog.reset();

            $timeout(function () {
                worklog.setMonth(currentMonth.name, function () {

                    var employee = currentEmployee.username();
                    worklog.enableEmployee(employee);
                    worklog.enableEmployeeProjects(employee);

                });

		var lastMonth = currentMonth.next();
                $scope.months = [];

		for(var i = 0; i < 13; i++){
                    $scope.months.push(lastMonth.name);
		    lastMonth = lastMonth.prev();
		}

            }, 600);
        };

	})
	.factory('currentMonth', function() {

		return new Month(moment().format('YYYY/MM'));
	});

var Month = function(month){
	
	var that = moment(month, 'YYYY/MM');
	
	return {
		
		name: that.format('YYYY/MM'),
		next: function(){
			return new Month(moment(that).add('month', 1).format('YYYY/MM'));
		},
		prev: function(){
			return new Month(moment(that).subtract('month', 1).format('YYYY/MM'));
		}
	};
};
