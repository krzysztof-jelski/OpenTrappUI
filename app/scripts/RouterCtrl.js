angular.module('openTrapp')
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider.when('/registration', {
            templateUrl: 'registration.html',
            access: {
                requiresLogin: true
            }
        });
        $routeProvider.when('/report', {
            templateUrl: 'report.html',
            access: {
                requiresLogin: true
            }
        });
        $routeProvider.when('/config', {
            templateUrl: 'configuration.html',
            access: {
                requiresLogin: true
            }
        });
        $routeProvider.when('/', {
            templateUrl: 'home.html',
            access: {
                requiresLogin: false
            }
        });
        $routeProvider.when('/authFailed', {
            templateUrl: 'auth-failed.html'
        });

        $routeProvider.when('/authToken/:authToken', {
            redirectTo: '/',
            reloadOnSearch: true,
            resolve: {
                auth: function ($route, $cookies, $rootScope, $location) {
                    $cookies.authToken = $route.current.params.authToken;
                    $rootScope.$emit('AuthTokenReceived');
                    $location.search({});
                }
            }
        });
        $routeProvider.otherwise({
            redirectTo: '/'
        });

        // configure html5 to get links working on jsfiddle
        $locationProvider.html5Mode(false);
    })
    .controller('RouterCtrl',
    function ($scope, $location) {
        $scope.isActive = function (path) {
            return ($location.path().substr(0, path.length) == path);
        };
    });

