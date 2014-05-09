angular.module('openTrapp')
    .controller('EditCtrl', function ($scope, $modal, projectNames, $http) {

        $scope.open = function (item) {

            var modalInstance = $modal.open({
                templateUrl: 'edit.html',
                controller: EditModalCtrl,
                resolve: {
                    item: function () {
                        return item;
                    },
                    projectNames: function () {
                        return projectNames;
                    },
                    http: function () {
                        return $http;
                    }
                }
            });

            modalInstance.result.then(function (result) {
                // FIXME - publish alert to some global alert displayer
                $scope.alerts = $scope.alerts || [];
                $scope.alerts.push(result)
            })

        };
    });

var EditModalCtrl = function ($scope, $modalInstance, item, projectNames, http) {

    var suggestions = [];
    (function gatherSuggestions() {
        suggestions = [];
        projectNames.forEach(function (name) {
            suggestions.push(name);
        })
    })();
    $scope.item = angular.copy(item);

    function getSuggestions(prefix) {
        return _.filter(suggestions, function (suggestion) {
            return suggestion.indexOf(prefix) != -1;
        });
    }

    $scope.$watch('item.projectName', function (newValue) {
        $scope.suggestions = getSuggestions(newValue);
    });

    $scope.ok = function () {
        var data = {
            workload: $scope.item.workload,
            projectName: $scope.item.projectName
        };
        http.post('http://localhost:8080/endpoints/v1/work-log/entries/' + item.id, data)
            .success(function () {
                $modalInstance.close({
                    type: 'success',
                    message: 'Worklog updated'
                });
            });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};
