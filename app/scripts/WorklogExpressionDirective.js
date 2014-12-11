angular.module('openTrapp')
    .directive('worklogExpression', function ($compile, projectNames, datesSuggestions) {
        return {
            restrict: 'E',
            template: '<input' +
                    ' class="form-control input-lg worklog-expression-input"' +
                    ' ng-model="workLogExpression"' +
                    ' ng-trim="false"' +
                    ' type="text"' +
                    ' placeholder="1d #my-project"' +
                    ' typeahead-wait-ms="100"' +
                    ' typeahead-on-select="selectSuggestion($item)"' +
                    ' typeahead-template-url="typeahead-template.html"' +
                    ' typeahead="s for s in suggestions($viewValue)"' +
                    '>' +
                    ' </input>',

            link: function ($scope, element) {
                inputElement = $(element).children()[0];

                var suggestionSourceFor = {
                    '#': projectNames,
                    '@': datesSuggestions
                };

                var tagRegexp = /.*(@|#)([^\s]*)$/;

                function currentlyEditedTagIn(input) {
                    var match = tagRegexp.exec(input);
                    if (match) {
                        return {symbol: match[1], value: match[2]};
                    } else {
                        return null;
                    }
                }

                function suggestionsFor(tag) {
                    var suggestions = [];
                    suggestionSourceFor[tag.symbol].startingWith(tag.value).forEach(function (suggestion) {
                        suggestions.push(suggestion);
                    });
                    return suggestions;
                }

                $scope.suggestions = function (expression) {
                    if (expression) {
                        var tag = currentlyEditedTagIn(expression.substring(0, $scope.getCursorPosition()));
                        if (tag) {
                            return suggestionsFor(tag);
                        }
                    }
                    return [];
                };

                $scope.getCursorPosition = function () {
                    return inputElement.selectionStart;
                };

                $scope.selectSuggestion = function (suggestion) {
                    if (suggestion.value) {
                        suggestion = suggestion.value;
                    }
                    var tag = currentlyEditedTagIn($(inputElement).val().substring(0, $scope.getCursorPosition()));
                    var replacementRegexp = new RegExp(tag.symbol + tag.value + '\\s*');
                    var completedTag = tag.symbol + suggestion;
                    $scope.workLogExpression = $(inputElement).val().replace(replacementRegexp, completedTag + ' ');
                };
            }
        }
    });
