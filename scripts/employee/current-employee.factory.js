angular
    .module('openTrapp.employee', [])
    .factory('currentEmployee', function () {

        var username = 'Anonymous';

        return {

            signedInAs: function (u) {
                username = u;
            },
            username: function () {
                return username;
            },
            isAuthenticated: function () {
                return username !== 'Anonymous';
            }
        };
    });
