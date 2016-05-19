angular
    .module('openTrapp.authentication')
    .config(function ($stateProvider) {
        $stateProvider
            .state('authFailed', {
                url: '/authFailed',
                templateUrl: 'authFailed.html',
                data: {
                    requiresLogin: false
                }
            })
            .state('authToken', {
                url: '/authToken/:authToken',
                data: {
                    requiresLogin: false
                },
                reloadOnSearch: true,
                controller: function ($state, $cookies, $rootScope) {
                    var receivedAuthToken = $state.params.authToken;
                    $cookies.put('authToken', receivedAuthToken);
                    $rootScope.$emit('AuthTokenReceived');
                    $state.go('home');
                }
            });
    });

