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

                var lastDesiredEffectOfCompletion = new EffectOfCompletion(0);

                var suggestionSourceFor = {
                    '#': projectNames,
                    '@': datesSuggestions
                };

                var tagRegexp = /.*(@|#)([^\s]*)$/;

                $scope.suggestions = function (expression) {
                    if (expression) {
                        var tag = currentlyEditedTagIn(expression.substring(0, $scope.getCursorPosition()));
                        if (tag) {
                            return suggestionsFor(tag);
                        }
                    }
                    return [];
                };

                $scope.selectSuggestion = function (suggestion) {
                    if (suggestion.value) {
                        suggestion = suggestion.value;
                    }
                    var currentExpression = $(inputElement).val();
                    var tag = currentlyEditedTagIn(currentExpression.substring(0, $scope.getCursorPosition()));
                    var replacementRegexp = new RegExp(tag.symbol + tag.value + '\\s*');
                    var completion = tag.symbol + suggestion + ' ';
                    var match = replacementRegexp.exec(currentExpression);
                    $scope.workLogExpression = currentExpression.replace(replacementRegexp, completion);
                    lastDesiredEffectOfCompletion = new EffectOfCompletion(match.index + completion.length);
                };

                $scope.getCursorPosition = function() {
                    return inputElement.selectionStart;
                };

                $scope.$watch('workLogExpression', function (newVal, oldVal) {
                    if (lastDesiredEffectOfCompletion.isNotApplied()) {
                        lastDesiredEffectOfCompletion.apply();
                    }
                });

                function suggestionsFor(tag) {
                    var suggestions = [];
                    suggestionSourceFor[tag.symbol].startingWith(tag.value).forEach(function (suggestion) {
                        suggestions.push(suggestion);
                    });
                    return suggestions;
                }

                function currentlyEditedTagIn(input) {
                    var match = tagRegexp.exec(input);
                    if (match) {
                        return {symbol: match[1], value: match[2]};
                    } else {
                        return null;
                    }
                }

                function EffectOfCompletion(desiredCursorPosition) {
                    var applied = false;
                    this.isNotApplied = function () {
                        return applied === false;
                    };
                    this.apply = function() {
                        setCursorPositionAfterItJumpedToTheEndOnInputValueChange(desiredCursorPosition);
                        applied = true;
                    };
                }

                function setCursorPositionAfterItJumpedToTheEndOnInputValueChange(position) {
                    moveCursorToPosition(position);
                }

                function moveCursorToPosition(position) {
                    inputElement.setSelectionRange(position, position);
                }
            }
        }
    });
