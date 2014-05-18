angular.module('openTrapp')
    .directive('suggester', function ($compile, projectNames, datesSuggestions) {
        return {
            scope: {},
            link: function (scope, element) {
                scope.suggestions = [];

                element.attr("typeahead-wait-ms", 100);
                element.attr("typeahead-on-select", "selectSuggestion($item)")
                element.attr("typeahead", "s for s in suggestions");
                element.attr("ng-model", "inputValue");
                element.removeAttr('suggester');
                $compile(element)(scope);


                var suggestionSourceFor = {
                    '#': projectNames,
                    '@': datesSuggestions
                };

                var tagRegexp = /.*(@|#)([^\s]*)$/;

                scope.$watch('inputValue', function (newVal, oldVal) {
                    if (newVal) {
                        scope.suggestions = [];
                        calculateSuggestions(newVal.substring(0, cursorPosition()));
                    }
                });

                function tagBeingEdited(input) {
                    var regexMatch = tagRegexp.exec(input);
                    if (regexMatch) {
                        return {symbol: regexMatch[1], value: regexMatch[2]};
                    } else {
                        return null;
                    }
                }

                function calculateSuggestions(input) {
                    var tag = tagBeingEdited(input);
                    if (tag) {
                        makeSuggestions(tag);
                    }
                }

                function makeSuggestions(tag) {
                    suggestionSourceFor[tag.symbol].startingWith(tag.value).forEach(function (suggestion) {
                        scope.suggestions.push(suggestion);
                    });
                }

                function cursorPosition() {
                    return element[0].selectionStart;
                }

                scope.selectSuggestion = function (suggestion) {
                    var s = element.val().substring(0, cursorPosition());
                    var tag = tagBeingEdited(s);
                    scope.inputValue = element.val().replace(tag.symbol + tag.value, tag.symbol + suggestion + ' ');
                };
            }
        }
    });
