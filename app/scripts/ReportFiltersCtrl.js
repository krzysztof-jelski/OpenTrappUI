var openTrapp = angular.module('openTrapp');

openTrapp
	.controller('ReportFiltersCtrl', function ($scope, $http, $timeout, worklog, currentMonth, currentEmployee, availableMonths,multiSelection, $document) {

        $scope.sort = {
            predicate: 'day',
            reverse: true
        };
		$scope.worklog = worklog;
		$scope.months = [];

		$scope.init = function() {
            $scope.selection = multiSelection;
            worklog.reset();

            $timeout(function () {
                worklog.setMonths([currentMonth.name], function () {

                    var employee = currentEmployee.username();
                    $scope.worklog.enableEmployee(employee);
                    $scope.worklog.enableEmployeeProjects(employee);

                });

				$scope.months = availableMonths.get(currentMonth);
				$scope.currentMonth = currentMonth;
				$scope.visibleMonth = currentMonth;

			}, 600);
        };

		$scope.nextVisibleMonth = function(){
			$scope.visibleMonth = $scope.visibleMonth.next();
			$scope.months = availableMonths.get($scope.visibleMonth);
		};

		$scope.prevVisibleMonth = function(){
			$scope.visibleMonth = $scope.visibleMonth.prev();
			$scope.months = availableMonths.get($scope.visibleMonth);
		};

        $scope.setCurrentMonth = function (month) {
            $scope.worklog.setMonths([month])
        };


        $scope.endSelection = function(month){
            $scope.selection.endSelection(month);
            $scope.worklog.setMonths($scope.selection.selected());
        }

	})
	.factory('currentMonth', function(timeProvider) {

		return new Month(timeProvider.moment().format('YYYY/MM'));
	});

var Month = function (month) {
	var that = moment(month, 'YYYY/MM');

	return {
		name: that.format('YYYY/MM'),
		next: function () {
			return new Month(moment(that).add('month', 1).format('YYYY/MM'));
		},
		prev: function () {
			return new Month(moment(that).subtract('month', 1).format('YYYY/MM'));
		}
	};
};


