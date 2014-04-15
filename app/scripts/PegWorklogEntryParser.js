angular.module('openTrapp').factory('worklogEntryParserN', function (timeProvider) {
    function doParse(expression) {
        return {
            workload: "1d",
            projectName: "unity",
            day: "2014/04/11"
        }
    }

    return{
        isValid: function (expression) {
            return !!doParse(expression);
        },
        parse: function (expression) {
            return doParse(expression);
        }
    }
});
