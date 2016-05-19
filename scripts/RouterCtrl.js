angular
    .module('openTrapp')
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home.html',
                data: {
                    requiresLogin: false
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

