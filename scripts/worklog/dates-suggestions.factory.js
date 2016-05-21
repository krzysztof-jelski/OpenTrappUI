angular
    .module('openTrapp.worklog')
    .factory('datesSuggestions', function ($q, timeProvider) {

        var possibleSuggestions = [
            "today",
            "yesterday",
            "tomorrow",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
            "t-1",
            "t-2",
            "t-3"
        ];

        return {
            loadAllStartingWith: loadAllStartingWith
        };

        function loadAllStartingWith(prefix) {
            var suggestions = _(possibleSuggestions)
                .map(function (suggestion) {
                    return {
                        name: suggestion,
                        day: mapSuggestionToDay(suggestion)
                    };
                })
                .filter(function (dateSuggestion) {
                    return dateSuggestion.name.indexOf(prefix) === 0
                        || dateSuggestion.day.indexOf(prefix) !== -1;
                })
                .map(function (dateSuggestion) {
                    return {
                        value: dateSuggestion.name,
                        description: dateSuggestion.day
                    };
                })
                .value();
            return $q.resolve(suggestions);
        }

        function mapSuggestionToDay(suggestion) {
            return PegWorkLogEntryParser
                .parse("#proj @" + suggestion, {timeProvider: timeProvider})
                .day;
        }

    });
