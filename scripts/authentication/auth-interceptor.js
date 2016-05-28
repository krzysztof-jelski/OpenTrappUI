angular
    .module('openTrapp.authentication')
    .factory('authInterceptor', function ($cookies) {

        return {

            request: function (config) {

                var savedAuthToken = $cookies.get('authToken');
                if (savedAuthToken && config.url.indexOf('/endpoints/') != -1) {
                    config.url = config.url + ';jsessionid=' + savedAuthToken;
                }
                return config;
            },
            response: function (config) {
                return config;
            }
        };

    })
    .run(function ($rootScope, $state, currentEmployee) {
        /* eslint no-unused-vars:"off" */
        var destroyableHandler = $rootScope.$on('$stateChangeStart', function (event, toState) {

            if (currentEmployee.isAuthenticated()) {
                if (toState.name === 'home') {
                    changeStateTo('registration');
                    return;
                }
            }
            if (!currentEmployee.isAuthenticated()) {
                if (doesRequireLogin(toState)) {
                    changeStateTo('home');
                }
            }

            function doesRequireLogin(state) {
                return angular.isDefined(state.data) && state.data.requiresLogin;
            }

            function changeStateTo(stateName) {
                event.preventDefault();
                $state.go(stateName);
            }
        });
    })
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    });
