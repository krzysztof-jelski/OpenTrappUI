angular
    .module('openTrapp.employee', [
        'ngCookies'
    ])
    .factory('currentEmployee', function ($cookies) {

        var username = 'Anonymous';

        return {
            signedInAs: function (user) {
                setCurrentUserTo(user);
            },
            username: function () {
                return currentUser();
            },
            isAuthenticated: function () {
                return currentUser() !== 'Anonymous';
            }
        };

        function currentUser() {
            return $cookies.get('currentUser');
        }

        function setCurrentUserTo(user) {
            $cookies.put('currentUser', user);
        }

    });
