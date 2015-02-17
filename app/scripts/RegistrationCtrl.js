angular.module('openTrapp').controller('RegistrationCtrl',
    function ($scope, $http, currentEmployee, worklogEntryParser, $sce, worklog, currentMonth, $timeout) {
        $scope.alerts = [];
        clearExpression();
        $scope.clearAlerts = function () {
            $scope.alerts = [];
        };

        $scope.currentMonth = currentMonth.name;

        $scope.init=function(){
            $timeout(function(){
                worklog.setMonths([currentMonth.name], function () {
                    var employee = currentEmployee.username();
                    worklog.enableEmployee(employee);
                    worklog.enableEmployeeProjects(employee);
                });
            },500)

        };

        $scope.logWork = function () {

            if (!worklogEntryParser.isValid(expression())) {
                return;
            }
            var data = worklogEntryParser.parse(expression());

            $http
                .post('http://localhost:8080/endpoints/v1/employee/' + currentEmployee.username() + '/work-log/entries', data)
                .success(function (response, status) {
                    clearExpression();
                    update();
                    var projectNames = _(data.projectNames).map(function (name) {
                        return sprintf("<b>%s</b>", name);
                    }).join(",");
                    var message = sprintf("<b>Hurray!</b> You  have successfully logged <b>%s</b> on %s at <b>%s</b>.", data.workload, projectNames, data.day);
                    $scope.alerts = [
                        { type: 'success', message: $sce.trustAsHtml(message)}
                    ];
                    worklog.refresh();
                }).error(function (response, status) {
                    var message = '<b>Upps...</b> Server is not responding.';
                    $scope.alerts = [
                        { type: 'danger', message: $sce.trustAsHtml(message)}
                    ];
                });
        };

        var update = function () {

            if (expression() == '') {
                $scope.status = '';
                return;
            }

            if (worklogEntryParser.isValid(expression())) {
                $scope.status = 'success';
            } else {
                $scope.status = 'error';
            }
        };

        $scope.$watch('workLogExpression', update);

        function expression() {
            return $scope.workLogExpression;
        }

        function clearExpression() {
            $scope.workLogExpression = '';
        }

    });
