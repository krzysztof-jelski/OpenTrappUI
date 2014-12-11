angular.module('openTrapp')
    .directive('worklogExpression', function ($compile, projectNames, datesSuggestions) {
        return {
            scope: false,
            restrict: 'E',
            template: '<input' +
                    ' class="form-control input-lg worklog-expression-input"' +
                    ' ng-model="workLogExpression"' +
                    ' ng-trim="false"' +
                    ' type="text"' +
                    ' placeholder="1d #my-project"' +
                    ' typeahead-wait-ms="100"' +
                    ' typeahead-on-select="selectSuggestion($item)"' +
                    ' typeahead-template-url=   "typeahead-template.html"' +
                    ' typeahead="s for s in suggestions"' +
                    '>' +
                    ' </input>',
            link: function ($scope, element) {
                $scope.suggestions = [];
                inputElement = $(element).children()[0];

                var suggestionSourceFor = {
                    '#': projectNames,
                    '@': datesSuggestions
                };

                var tagRegexp = /.*(@|#)([^\s]*)$/;

                $scope.$watch('workLogExpression', function (newVal, oldVal) {
                    if (newVal) {
                        $scope.suggestions = [];
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
                        $scope.suggestions.push(suggestion);
                    });
                }

                $scope.getCursorPosition = function () {
                    return $(inputElement)[0].selectionStart;
                };

                function cursorPosition() {
                    return $scope.getCursorPosition();
                }

                $scope.selectSuggestion = function (suggestion) {
                    if (suggestion.value) {
                        suggestion = suggestion.value;
                    }
                    var tag = tagBeingEdited($(inputElement).val().substring(0, cursorPosition()));
                    $scope.workLogExpression = $(inputElement).val().replace(new RegExp(tag.symbol + tag.value + '\\s*'), tag.symbol + suggestion + ' ');
                };
            }
        }
    });
