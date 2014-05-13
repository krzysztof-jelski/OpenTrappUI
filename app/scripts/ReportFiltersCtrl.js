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

                $scope.months = [
                    currentMonth.next().name,
                    currentMonth.name,
                    currentMonth.prev().name,
                    currentMonth.prev().prev().name
                ];
            }, 600);
        }

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