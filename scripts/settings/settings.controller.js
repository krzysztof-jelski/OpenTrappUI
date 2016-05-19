angular
    .module('openTrapp.settings')
    .controller('SettingsCtrl',
        function ($scope, $cookies) {
            $scope.init = function () {

                $scope.apiServerUrl = 'http://open-trapp.herokuapp.com';
                var savedApiServerUrl = $cookies.get('apiServerUrl');
                if (savedApiServerUrl) {
                    $scope.apiServerUrl = savedApiServerUrl;
                }
            };

            $scope.cancel = function () {

                $scope.init();
            };

            $scope.save = function () {

                $cookies.put('apiServerUrl', $scope.apiServerUrl);
                $scope.alert = 'Settings have been saved!';
            }
        }
    );
