angular
    .module('openTrapp.authentication')
    .controller('AuthenticationController', function ($state, $cookies, $rootScope) {
        var receivedAuthToken = $state.params.authToken;
        $cookies.put('authToken', receivedAuthToken);
        $rootScope.$emit('AuthTokenReceived');
    });

