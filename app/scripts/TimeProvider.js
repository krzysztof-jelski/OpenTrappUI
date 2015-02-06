angular.module('openTrapp').factory('timeProvider', function () {
    return{
        getCurrentDate: function () {
            return new Date();
        },
        moment: function () {
            return moment();
        }
    }
});
