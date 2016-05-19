angular
    .module('openTrapp.time')
    .factory('timeProvider', function () {
        return {
            getCurrentDate: function () {
                return new Date();
            },
            moment: function () {
                return moment();
            }
        }
    });
