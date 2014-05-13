angular.module('openTrapp').controller('RegistrationCtrl',
    function ($scope, $http, currentEmployee, worklogEntryParser, projectNames, $sce,timeProvider,datesSuggestions) {

        $scope.alerts = [];
        $scope.workLogExpression = '';
        $scope.suggestions = [];
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

        var projectNameRegexp = /.*#([^\s]*)$/;
        var timeRegexp = /.*@([^\s]*)$/;

        function enteredProjectName(input) {
            return projectNameRegexp.exec(input)[1];
        }
        function isEditingProjectName(input) {
            return projectNameRegexp.test(input)
        }
        function enteredTime(input) {
            return timeRegexp.exec(input)[1];
        }
        function isEditingTime(input) {
            return timeRegexp.test(input);
        }

        function assignToSuggestions(suggestions) {
            $scope.suggestions = [];
            suggestions.forEach(function (suggestion) {
                $scope.suggestions.push(suggestion);
            });
        }

        function suggestProjectNames(input) {
            var prefix = enteredProjectName(input);
            assignToSuggestions(projectNames.startingWith(prefix));
        }

        function suggestTime(input) {
            var prefix = enteredTime(input);
            assignToSuggestions(datesSuggestions.startingWith(prefix));
        }

        function calculateSuggestions(input) {
            if (isEditingProjectName(input)) {
                suggestProjectNames(input);
            } else if (isEditingTime(input)) {
                suggestTime(input);
            } else {
                $scope.suggestions = [];
            }
        }

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

        // AngularUI sucks
        var tmp = '';

        $scope.$watch('workLogExpression', function (newVal, oldVal) {
            tmp = newVal;
            calculateSuggestions(newVal);
            update();
        });

        $scope.selectSuggestion = function (suggestion) {

            var prefix = enteredProjectName(tmp);
            $scope.workLogExpression = tmp.replace('#' + prefix, '#' + suggestion + ' ');
        };
    });
