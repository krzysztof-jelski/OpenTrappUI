angular
    .module("openTrapp.report")
    .factory('availableMonths', function () {
        return {
            get: function (currentMonth) {
                var lastMonth = currentMonth.next().next();

                var months = [];

                for (var i = 0; i < 5; i++) {
                    months.push(lastMonth.name);
                    lastMonth = lastMonth.prev();
                }
                return months;
            }
        }
    });