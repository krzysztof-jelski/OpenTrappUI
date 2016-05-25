(function () {

    angular
        .module('openTrapp.time')
        .factory('currentMonth', function (timeProvider) {
            return new Month(timeProvider.moment().format('YYYY/MM'));
        })
        .value('Month', Month);

    function Month(month) {
        var that = moment(month, 'YYYY/MM');

        return {
            name: that.format('YYYY/MM'),
            next: function () {
                return new Month(moment(that).add('month', 1).format('YYYY/MM'));
            },
            prev: function () {
                return new Month(moment(that).subtract('month', 1).format('YYYY/MM'));
            }
        };
    }

})();

