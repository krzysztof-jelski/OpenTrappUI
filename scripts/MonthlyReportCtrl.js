angular.module('openTrapp')
	.controller('MonthlyReportCtrl', function($scope, worklog, $http){

        var currentMonth = null;
		$scope.days = [];
		$scope.report = {};
		$scope.init = function(){
            worklog.onUpdate(function(){
                fetchDays();
                calculateDays();
			});
		};

        $scope.satisfies = function() {
            return false;
        };
		
		var fetchDays = function(){
            
            if(currentMonth && currentMonth.valueOf() === worklog.month.valueOf()){
                return;
            } else {
                currentMonth = worklog.month;
            }
            
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
			$scope.report = new WorkloadReport();

            _(worklog.entries).forEach(function(worklogEntry){
                $scope.report.updateWorkload(worklogEntry);
            });
            $scope.report.roundToHours();
        };
	});