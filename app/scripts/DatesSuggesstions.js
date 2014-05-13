angular.module('openTrapp').factory('datesSuggestions', function (timeProvider) {
    var possibleSuggestions = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "t-1", "t-2", "t-3"];

    function mapSuggestionToDay(suggestion) {
        return PegWorkLogEntryParser.parse("#proj @" + suggestion, { timeProvider: timeProvider }).day;
    }

    return {
        startingWith: function (prefix) {
            return _(_(possibleSuggestions).map(function (suggestion) {
                return {
                    name: suggestion,
                    day: mapSuggestionToDay(suggestion)
                };
            }).filter(function (entry) {
                return entry.name.indexOf(prefix) === 0 || entry.day.indexOf(prefix) === 0;
            }).map(function (entry) {
                return entry.name + " (" + entry.day + ")";
            }));
        }

    }
});
