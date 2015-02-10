angular.module("openTrapp")
    .factory('availableMonths', function () {
        return {
            get: function (currentMonth, numberOfMonths) {
                numberOfMonths = numberOfMonths || 4;

                var lastMonth = currentMonth;
                var months = [];

                for (var i = 0; i < numberOfMonths; i++) {
                    lastMonth = lastMonth.prev();
                }

                for (var i = 0; i < numberOfMonths*2 +1; i++) {
                    months.push(lastMonth.name);
                    lastMonth = lastMonth.next();
                }
                return months;
            }
        }
    });