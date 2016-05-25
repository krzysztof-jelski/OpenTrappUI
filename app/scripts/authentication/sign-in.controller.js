angular
    .module('openTrapp.authentication')
    .controller('SignInController', function ($log, $rootScope, $http, $location, currentEmployee) {
        var self = this;

        /* eslint no-unused-vars:"off" */
        var destroyableHandler = $rootScope.$on('AuthTokenReceived', function () {
            $log.log('AuthTokenReceived');
            init();
        });

        init();

        function init() {
                $http.get('http://localhost:8080/endpoints/v1/authentication/status')
                    .then(function (response) {
                        var data = response.data;
                        self.displayName = data.displayName;
                        self.authenticated = data.authenticated;
                        self.unauthenticated = !data.authenticated;
                        self.username = data.username;
                        self.loginUrl = data.loginUrl + "?redirect_to=" + $location.absUrl();
                        self.logoutUrl = data.logoutUrl + "?redirect_to=" + $location.absUrl();

                        $rootScope.currentUser = self.username;

                        currentEmployee.signedInAs(data.username);
                    });
        }

        }
    );
