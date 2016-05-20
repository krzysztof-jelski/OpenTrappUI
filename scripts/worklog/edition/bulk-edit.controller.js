angular
    .module('openTrapp.worklog.edition')
    .controller('BulkEditCtrl', function ($scope, $modal, worklog) {

        $scope.open = function (query) {

            var modalInstance = $modal.open({
                templateUrl: 'templates/worklog/edition/bulk-edit.html',
                controller: BulkEditModalCtrl,
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

    });

var BulkEditModalCtrl = function ($modalInstance, $scope, $http, query) {

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
            .success(function () {
                $modalInstance.close();
                $scope.alerts = [];
            })
            .error(function () {
                $scope.shake();
            })
            .error(printError);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.clearAlerts = function () {
        $scope.alerts = [];
    };

    function onQueryChange(query) {
        if (query === undefined) {
            return;
        }
        $http.get("http://localhost:8080/endpoints/v1/work-log/" + encodeQuery(query))
            .success(function (data) {
                $scope.entriesAffected = data.entriesAffected;
                $scope.alerts = [];
            })
            .error(printError);
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

    function printError(response, status) {
        $scope.entriesAffected = false;
        $scope.alerts = [
            {type: 'danger', message: response.error}
        ];
    }
};
