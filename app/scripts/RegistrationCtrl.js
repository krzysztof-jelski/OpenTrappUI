angular.module('openTrapp').controller('RegistrationCtrl',
    function ($scope, $http, currentEmployee, worklogEntryParser, $sce) {

        $scope.alerts = [];
        $scope.workLogExpression = '';
        $scope.clearAlerts = function () {
            $scope.alerts = [];
        };
        $scope.logWork = function () {

            if (!worklogEntryParser.isValid($scope.workLogExpression)) {
                return;
            }
            var data = worklogEntryParser.parse($scope.workLogExpression);

            $http
                .post('http://localhost:8080/endpoints/v1/employee/' + currentEmployee.username() + '/work-log/entries', data)
                .success(function (response, status) {
                    $scope.workLogExpression = '';
                    update();
                    var message = sprintf("<b>Hurray!</b> You  have successfully logged <b>%s</b> on project <b>%s</b> at <b>%s</b>.", data.workload, data.projectName, data.day);
                    $scope.alerts = [
                        { type: 'success', message: $sce.trustAsHtml(message)}
                    ];
                }).error(function (response, status) {
                    var message = '<b>Upps...</b> Server is not responding.';
                    $scope.alerts = [
                        { type: 'danger', message: $sce.trustAsHtml(message)}
                    ];
                });
        };

        var update = function () {

            if ($scope.workLogExpression == '') {
                $scope.status = '';
                return;
            }

            if (worklogEntryParser.isValid($scope.workLogExpression)) {
                $scope.status = 'success';
            } else {
                $scope.status = 'error';
            }
        };

        $scope.$watch('workLogExpression', update);

    });
