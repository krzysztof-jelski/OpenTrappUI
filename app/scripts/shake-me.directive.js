angular
    .module('openTrapp')
    .directive('shakeMe', ['$animate', function ($animate) {

        return {
            link: function (scope, element) {

                scope.$parent.shake = function () {

                    var e = element.parent('.modal-content');
                    $animate.addClass(e, 'shake', function () {
                        $animate.removeClass(e, 'shake');
                    });
                };
            }
        };

    }]);
