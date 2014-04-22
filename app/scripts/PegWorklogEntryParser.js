angular.module('openTrapp').factory('worklogEntryParser', function (timeProvider) {
    function doParse(expression) {
        return PegWorkLogEntryParser.parse(expression);
    }

    return{
        isValid: function (expression) {
            try {
                doParse(expression);
                return true;
            } catch (e) {
                return false;
            }
        },
        parse: function (expression) {
            return doParse(expression);
        }
    }
});
