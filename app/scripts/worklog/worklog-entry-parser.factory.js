angular
    .module('openTrapp.worklog')
    .factory('worklogEntryParser', function (timeProvider) {

        function doParse(expression) {
            return PegWorkLogEntryParser.parse(expression.trim(), {timeProvider: timeProvider});
        }

        return {
            isValid: function (expression) {
                return angular.isDefined(this.parse(expression));
            },
            parse: function (expression) {
                try {
                    return doParse(expression);
                } catch (e) {
                    return undefined;
                }
            }
        }

    });
