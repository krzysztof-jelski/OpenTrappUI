angular
    .module('openTrapp.report')
    .controller('ReportController', function ($scope, $http, $timeout, $state, worklog, currentMonth, currentEmployee, availableMonths) {
        $scope.sort = {
            predicate: 'day',
            reverse: true
        };
        $scope.worklog = worklog;
        $scope.months = [];

        $scope.init = function () {

            worklog.reset();

            $timeout(function () {
                worklog.setMonth(currentMonth.name, function () {

                    var employee = currentEmployee.username();
                    worklog.enableEmployee(employee);
                    worklog.enableEmployeeProjects(employee);

                });

                $scope.months = availableMonths.get(currentMonth);
                $scope.currentMonth = currentMonth;
                $scope.visibleMonth = currentMonth;

            }, 600);
        };

        $scope.nextVisibleMonth = function () {
            $scope.visibleMonth = $scope.visibleMonth.next();
            $scope.months = availableMonths.get($scope.visibleMonth);
        };

        $scope.prevVisibleMonth = function () {
            $scope.visibleMonth = $scope.visibleMonth.prev();
            $scope.months = availableMonths.get($scope.visibleMonth);
        };

        $scope.init();
        $scope.display = function () {
            return $state.$current.data.reportType;
        }

    });