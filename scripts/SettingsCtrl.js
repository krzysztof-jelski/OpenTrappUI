angular.module('openTrapp').controller('SettingsCtrl',
    function ($scope, $cookies) {
        $scope.init = function () {

            $scope.apiServerUrl = 'localhost:8080';
            if ($cookies.apiServerUrl) {
                $scope.apiServerUrl = $cookies.apiServerUrl;
            }
        };

        $scope.cancel = function () {

            $scope.init();
        };

        $scope.save = function () {

            $cookies.apiServerUrl = $scope.apiServerUrl;
            $scope.alert = 'Settings have been saved!';
        }
    }
);
