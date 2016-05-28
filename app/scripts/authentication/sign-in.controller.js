angular
    .module('openTrapp.authentication')
    .controller('SignInController', function ($state, $rootScope, $http, $location, currentEmployee) {
        var self = this;

        /* eslint no-unused-vars:"off" */
        var destroyableHandler = $rootScope.$on('AuthTokenReceived', function () {
            init();
        });

            init();

        function init() {

            self.authenticated = false;
            self.unauthenticated = false;
            currentEmployee.clear();

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

                        if (currentEmployee.isAuthenticated()) {
                            $state.go('registration');
                        } else {
                            $state.go('home');
                        }
                    });
        }

        }
    );
