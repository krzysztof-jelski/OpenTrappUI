angular
    .module('openTrapp.worklog')
    .controller('BulkEditCtrl', function ($uibModal, worklog) {
        var self = this;

        self.open = open;
        self.query = query;

        function open(query) {

            var modalInstance = $uibModal.open({
                templateUrl: 'templates/worklog/bulk-edit.html',
                controller: 'BulkEditModalCtrl',
                controllerAs: 'bulkEdit',
                resolve: {
                    query: function () {
                        return query;
                    }
                }
            });

            modalInstance.result.then(function () {
                worklog.refresh();
            });
        }

        function query() {
            return worklog.asQueryExpression();
        }

    })
    .controller('BulkEditModalCtrl', function ($uibModalInstance, $http, query) {
        var self = this;

        self.query = undefined;
        self.onQueryChange = onQueryChange;
        self.form = {
            query: query,
            expression: ""
        };
        self.alerts = [];
        self.entriesAffected = false;
        self.ok = ok;
        self.cancel = cancel;
        self.clearAlerts = clearAlerts;

        onQueryChange(query);

        function ok() {

            var data = {
                query: self.form.query,
                expression: self.form.expression
            };

            $http.post('http://localhost:8080/endpoints/v1/work-log/bulk-update', data)
                .then(function () {
                    $uibModalInstance.close();
                    self.alerts = [];
                });
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function clearAlerts() {
            self.alerts = [];
        }

        function onQueryChange(query) {
            if (angular.isUndefined(query)) {
                return;
            }
            $http.get("http://localhost:8080/endpoints/v1/work-log/" + encodeQuery(query))
                .then(function (response) {
                    self.entriesAffected = response.data.entriesAffected;
                    self.alerts = [];
                })
                .catch(function (response) {
                    printError(response.data);
                });
        }

        function encodeQuery(query) {
            return query
                .replace(/#/g, "!project=")
                .replace(/\*/g, "!employee=")
                .replace(/@/g, "!date=")
                .replace(/\s/g, "+")
                .replace(/\//g, ":");
        }

        function printError(response) {
            self.entriesAffected = false;
            self.alerts = [
                {type: 'danger', message: response.error}
            ];
        }
    });
