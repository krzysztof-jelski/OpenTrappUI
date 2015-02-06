angular.module("openTrapp")
    .factory('availableMonths', function (currentMonth) {
        return {
            get: function () {
                var lastMonth = currentMonth.next().next();

                var months = [];

                for (var i = 0; i < 13; i++) {
                    months.push(lastMonth.name);
                    lastMonth = lastMonth.prev();
                }
                return months;
            }
        }
    });