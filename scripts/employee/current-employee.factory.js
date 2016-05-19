angular
    .module('openTrapp.employee', [
        'ngCookies'
    ])
    .factory('currentEmployee', function ($cookies) {

        return {
            signedInAs: signedInAs,
            username: username,
            isAuthenticated: isAuthenticated
        };

        function signedInAs(user) {
            setCurrentUserTo(user);
        }

        function username() {
            return currentUser();
        }

        function isAuthenticated() {
            return currentUser() !== 'Anonymous';
        }

        function currentUser() {
            return $cookies.get('currentUser');
        }

        function setCurrentUserTo(user) {
            $cookies.put('currentUser', user);
        }

    });
