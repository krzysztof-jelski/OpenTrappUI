angular.module('openTrapp')
    .directive('suggester', function ($compile, projectNames, datesSuggestions) {
        return {
            link: function (scope, element) {
                scope.suggestions = [];

                element.attr("typeahead-wait-ms", 100);
                element.attr("typeahead-on-select", "selectSuggestion($item)")
                element.attr("typeahead-template-url", "typeahead-template.html")
                element.attr("typeahead", "s for s in suggestions");
                element.attr("ng-model", "workLogExpression");
                element.removeAttr('suggester');
                $compile(element)(scope);


                var suggestionSourceFor = {
                    '#': projectNames,
                    '@': datesSuggestions
                };

                var tagRegexp = /.*(@|#)([^\s]*)$/;

                scope.$watch('workLogExpression', function (newVal, oldVal) {
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

                scope.getCursorPosition = function () {
                    return element[0].selectionStart;
                };

                function cursorPosition() {
                    return scope.getCursorPosition();
                }

                scope.selectSuggestion = function (suggestion) {
                    if (suggestion.value) {
                        suggestion = suggestion.value;
                    }
                    var tag = tagBeingEdited(element.val().substring(0, cursorPosition()));
                    scope.workLogExpression = element.val().replace(new RegExp(tag.symbol + tag.value + '\\s*'), tag.symbol + suggestion + ' ');
                };
            }
        }
    });
