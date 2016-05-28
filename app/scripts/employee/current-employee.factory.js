angular
    .module('openTrapp.employee', [
        'ngCookies'
    ])
    .factory('currentEmployee', function ($cookies) {

        var ANONYMOUS = 'Anonymous';

        return {
            signedInAs: signedInAs,
            clear: clear,
            username: username,
            isAuthenticated: isAuthenticated
        };

        function signedInAs(user) {
            setCurrentUserTo(user);
        }

        function clear() {
            setCurrentUserTo(ANONYMOUS);
        }

        function username() {
            return currentUser();
        }

        function isAuthenticated() {
            return currentUser() !== ANONYMOUS;
        }

        function currentUser() {
            return $cookies.get('currentUser');
        }

        function setCurrentUserTo(user) {
            $cookies.put('currentUser', user);
        }

    });
