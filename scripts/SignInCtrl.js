angular.module('openTrapp').controller('SignInCtrl',
    function ($scope, $rootScope, $http, $location, currentEmployee) {
        $scope.init = function () {
            $http.get('http://localhost:8080/endpoints/v1/authentication/status').success(function (data) {
                $scope.displayName = data.displayName;
                $scope.authenticated = data.authenticated;
                $scope.unauthenticated = !data.authenticated;
                $scope.username = data.username;
                $rootScope.currentUser = $scope.username;
                $scope.loginUrl = data.loginUrl;
                $scope.logoutUrl = data.logoutUrl;

                currentEmployee.signedInAs(data.username);
            });
        };
        $rootScope.$on('AuthTokenReceived', function () {
            console.log('AuthTokenReceived');
            $scope.init();
        });
    }
);
