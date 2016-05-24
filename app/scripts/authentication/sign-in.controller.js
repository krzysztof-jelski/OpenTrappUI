angular
    .module('openTrapp.authentication')
    .controller('SignInCtrl',
        function ($log, $scope, $rootScope, $http, $location, currentEmployee) {
            $scope.init = function () {
                $http.get('http://localhost:8080/endpoints/v1/authentication/status')
                    .then(function (response) {
                        var data = response.data;
                        $scope.displayName = data.displayName;
                        $scope.authenticated = data.authenticated;
                        $scope.unauthenticated = !data.authenticated;
                        $scope.username = data.username;
                        $rootScope.currentUser = $scope.username;
                        $scope.loginUrl = data.loginUrl + "?redirect_to=" + $location.absUrl();
                        $scope.logoutUrl = data.logoutUrl + "?redirect_to=" + $location.absUrl();

                        currentEmployee.signedInAs(data.username);
                    });
            };
            var destroyableHandler = $rootScope.$on('AuthTokenReceived', function () {
                $log.log('AuthTokenReceived');
                $scope.init();
            });
        }
    );
