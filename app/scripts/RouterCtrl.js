angular
    .module('openTrapp')
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('registration', {
                url: '/registration',
                templateUrl: 'registration.html',
                data: {
                    requiresLogin: true
                }
            })
            .state('report', {
                url: '/report',
                templateUrl: 'report.html',
                data: {
                    requiresLogin: true
                }
            })
            .state('home', {
                url: '/',
                templateUrl: 'home.html',
                data: {
                    requiresLogin: false
                }
            })
            .state('config', {
                url: '/config',
                templateUrl: 'configuration.html',
                data: {
                    requiresLogin: true
                }
            })
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

        $urlRouterProvider.otherwise('/');
    })
    .controller('RouterCtrl',
        function ($scope, $location) {
            $scope.isActive = function (path) {
                return ($location.path().substr(0, path.length) == path);
            };
        });

