angular
    .module('openTrapp.report')
    .controller('ReportController', function ($scope, $http, $timeout, $state, worklog, currentMonth, currentEmployee, availableMonths) {
        $scope.sort = {
            predicate: 'day',
            reverse: true
        };
        $scope.worklog = worklog;
        $scope.months = [];
        $scope.nextVisibleMonth = nextVisibleMonth;
        $scope.prevVisibleMonth = prevVisibleMonth;
        $scope.display = reportType;

        init();

        function init() {
            worklog.reset();
            $timeout(setMonths, 600);
        }

        function reportType() {
            return $state.$current.data.reportType;
        }

        function setMonths() {
            worklog.setMonth(currentMonth.name, function () {
                var employee = currentEmployee.username();
                worklog.enableEmployee(employee);
                worklog.enableEmployeeProjects(employee);

            });
            $scope.months = availableMonths.get(currentMonth);
            $scope.currentMonth = currentMonth;
            $scope.visibleMonth = currentMonth;
        }

        function nextVisibleMonth() {
            $scope.visibleMonth = $scope.visibleMonth.next();
            $scope.months = availableMonths.get($scope.visibleMonth);
        }

        function prevVisibleMonth() {
            $scope.visibleMonth = $scope.visibleMonth.prev();
            $scope.months = availableMonths.get($scope.visibleMonth);
        }

    });