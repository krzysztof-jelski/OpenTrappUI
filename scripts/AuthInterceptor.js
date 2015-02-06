angular.module('openTrapp')
    .factory('authInterceptor', function ($cookies, $location) {

    return {

        request: function (config) {

            if ($cookies.authToken && config.url.indexOf('/endpoints/') != -1) {
                config.url = config.url + ';jsessionid=' + $cookies.authToken;
            }
            return config;
        },
        response: function (config) {
            return config;
        }
    };

    });

angular.module('openTrapp')
    .run(function ($rootScope, $route, $location, currentEmployee) {

        function accessRequired(path) {
            var access = $route.routes[path] !== undefined ? $route.routes[path].access : undefined;
            return access !== undefined && access.requiresLogin;
        }

        $rootScope.$on('$locationChangeStart', function () {
            if (accessRequired($location.path()) && !currentEmployee.isAuthenticated()) {
                $location.path("/");
            }

        });
    });

angular.module('openTrapp').config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
});
