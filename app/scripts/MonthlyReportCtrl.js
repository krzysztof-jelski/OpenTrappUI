angular.module('openTrapp')
	.controller('MonthlyReportCtrl', function($scope, worklog, $http){

		$scope.days = [];
		$scope.report = {};
		$scope.init = function(){
			worklog.onUpdate(function(){
				fetchDays();
				calculateDays();
			});
		};

		var toHours = function(minutes){
			return (Math.round((minutes/60)*100)/100).toString();
		};
		
		var fetchDays = function(){
			$http.get('http://localhost:8080/endpoints/v1/calendar/' + worklog.month).success(function(data){
				$scope.days = _(data.days).map(function(d){
					
					var m = moment(d.id, 'YYYY/MM/DD');
					
					return {
						id: d.id,
						number: m.format('DD'),
						name: m.format('ddd'),
						holiday: d.holiday
					}
				}).value();
			});
		};
		
		var calculateDays = function(){
			$scope.report = {};

            _(worklog.entries).forEach(function(worklogEntry){
                updateEmployeeWorkload(worklogEntry);
                updateTotalWorkload(worklogEntry);
            });

			_($scope.report).forEach(function(employee){
				_(employee).forEach(function(minutes, day){
					employee[day] = toHours(minutes);
				});
			});

            function updateEmployeeWorkload(worklogEntry) {
                var rowName = worklogEntry.employee;
                updateRowWithWorkload(rowName, worklogEntry);
            }

            function updateTotalWorkload(worklogEntry) {
                updateRowWithWorkload('Total', worklogEntry);
            }

            function addWorkloadToCell(row, column, workload) {
                var currentWorkload = (row[column] || 0);
                row[column] = currentWorkload + workload;
            }

            function updateRowWithWorkload(key, worklogEntry) {
                var row = $scope.report[key] || {};

                var minutes = new Workload(worklogEntry.workload).minutes;
                addWorkloadToCell(row, worklogEntry.day, minutes);
                addWorkloadToCell(row, 'total', minutes);

                $scope.report[key] = row;
            }
        };
	});