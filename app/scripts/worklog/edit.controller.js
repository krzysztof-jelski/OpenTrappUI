angular
    .module('openTrapp.worklog')
    .controller('EditCtrl', function ($scope, $uibModal, projectNames, worklog) {

        $scope.open = function (item) {

            var modalInstance = $uibModal.open({
                templateUrl: 'templates/worklog/edition/edit.html',
                controller: 'EditModalCtrl',
                resolve: {
                    item: function () {
                        return item;
                    },
                    projectNames: function () {
                        return projectNames;
                    },
                    worklog: function () {
                        return worklog;
                    }
                }
            });

            modalInstance.result.then(function (result) {
                // FIXME - publish alert to some global alert displayer
                $scope.alerts = $scope.alerts || [];
                $scope.alerts.push(result)
            })

        };
    })
    .controller('EditModalCtrl', function ($log, $scope, $uibModalInstance, item, $http, worklog) {

        $scope.item = angular.copy(item);

        $scope.isInvalidWorkload = function (workload) {
            return !Workload.isValid(workload);
        };

        $scope.ok = function () {
            var data = {
                workload: $scope.item.workload,
                projectName: $scope.item.projectName
            };
            $http.post('http://localhost:8080/endpoints/v1/work-log/entries/' + item.id, data)
                .then(function () {
                    $uibModalInstance.close({
                        type: 'success',
                        message: 'Worklog updated'
                    });
                    worklog.refresh();
                })
                .catch(function () {
                    $log.error('error');
                    $scope.shake();
                });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

angular.module('openTrapp')
    .directive('shakeMe', ['$animate', function ($animate) {

        return {
            link: function (scope, element) {

                scope.$parent.shake = function () {

                    var e = element.parent('.modal-content');
                    $animate.addClass(e, 'shake', function () {
                        $animate.removeClass(e, 'shake');
                    });
                };
            }
        };

    }]);
