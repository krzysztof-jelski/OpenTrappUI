angular
    .module('openTrapp.worklog')
    .factory('datesSuggestions', function (timeProvider) {
        var possibleSuggestions = ["today", "yesterday", "tomorrow", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "t-1", "t-2", "t-3"];

        function mapSuggestionToDay(suggestion) {
            return PegWorkLogEntryParser.parse("#proj @" + suggestion, {timeProvider: timeProvider}).day;
        }

        return {
            startingWith: function (prefix) {
                return _(_(possibleSuggestions).map(function (suggestion) {
                    return {
                        name: suggestion,
                        day: mapSuggestionToDay(suggestion)
                    };
                }).filter(function (entry) {
                    return entry.name.indexOf(prefix) === 0 || entry.day.indexOf(prefix) !== -1;
                }).map(function (entry) {
                    return {
                        value: entry.name,
                        description: entry.day
                    };
                }));
            }

        }
    });
