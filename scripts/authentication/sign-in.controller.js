angular
    .module('openTrapp.authentication')
    .controller('SignInController', function ($state, $rootScope, $http, $location, $interval, currentEmployee) {
        var self = this;

        /* eslint no-unused-vars:"off" */
        var destroyableHandler = $rootScope.$on('AuthTokenReceived', function () {
            setUpSessionData();
        });

        setUpSessionData();

        function setUpSessionData() {

            self.authenticated = false;
            self.unauthenticated = false;
            currentEmployee.clear();

            tryToSetUpSessionData();
            var setUpSessionDataRepetitiveTrials = $interval(tryToSetUpSessionData, 1000);

            function tryToSetUpSessionData() {
                $http.get('http://localhost:8080/endpoints/v1/authentication/status')
                    .then(function (response) {

                        if (setUpSessionDataRepetitiveTrials) {
                            $interval.cancel(setUpSessionDataRepetitiveTrials);
                        }

                        setUpSessionDataWith(response.data);

                        if (currentEmployee.isAuthenticated()) {
                            $state.go('registration');
                        } else {
                            $state.go('home');
                        }

                    });
            }
        }

        function setUpSessionDataWith(dataFromServer) {
            self.displayName = dataFromServer.displayName;
            self.authenticated = dataFromServer.authenticated;
            self.unauthenticated = !dataFromServer.authenticated;
            self.username = dataFromServer.username;
            self.loginUrl = dataFromServer.loginUrl + "?redirect_to=" + $location.absUrl();
            self.logoutUrl = dataFromServer.logoutUrl + "?redirect_to=" + $location.absUrl();

            $rootScope.currentUser = self.username;

            currentEmployee.signedInAs(dataFromServer.username);
        }

        }
    );
