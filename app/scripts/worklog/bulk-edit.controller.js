angular
    .module('openTrapp.worklog')
    .controller('BulkEditCtrl', function ($scope, $uibModal, worklog) {

        $scope.open = function (query) {

            var modalInstance = $uibModal.open({
                templateUrl: 'templates/worklog/edition/bulk-edit.html',
                controller: 'BulkEditModalCtrl',
                resolve: {
                    query: function () {
                        return query;
                    }
                }
            });

            modalInstance.result.then(function () {
                worklog.refresh();
            });
        };

        $scope.query = function () {
            return worklog.asQueryExpression();
        };

    })
    .controller('BulkEditModalCtrl', function ($uibModalInstance, $scope, $http, query) {

        $scope.onQueryChange = onQueryChange;
        $scope.form = {
            query: query,
            expression: ""
        };
        $scope.alerts = [];

        $scope.onQueryChange(query);

        $scope.ok = function () {

            var data = {
                query: $scope.form.query,
                expression: $scope.form.expression
            };

            $http.post('http://localhost:8080/endpoints/v1/work-log/bulk-update', data)
                .then(function () {
                    $uibModalInstance.close();
                    $scope.alerts = [];
                })
                .catch(function (response) {
                    $scope.shake();
                    printError(response.data);
                });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.clearAlerts = function () {
            $scope.alerts = [];
        };

        function onQueryChange(query) {
            if (query === undefined) {
                return;
            }
            $http.get("http://localhost:8080/endpoints/v1/work-log/" + encodeQuery(query))
                .then(function (response) {
                    $scope.entriesAffected = response.data.entriesAffected;
                    $scope.alerts = [];
                })
                .catch(function (response) {
                    printError(response.data);
                });
            $scope.query = query;
        }

        function encodeQuery(query) {
            query = query.replace(/#/g, "!project=");
            query = query.replace(/\*/g, "!employee=");
            query = query.replace(/@/g, "!date=");
            query = query.replace(/\s/g, "+");
            query = query.replace(/\//g, ":");
            return query;
        }

        function printError(response) {
            $scope.entriesAffected = false;
            $scope.alerts = [
                {type: 'danger', message: response.error}
            ];
        }
    });
