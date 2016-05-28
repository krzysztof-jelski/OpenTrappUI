angular
    .module('openTrapp')
    .controller('RouterController', function ($location) {
        var self = this;
        self.isActive = function (path) {
            return ($location.path().substr(0, path.length) == path);
        };
    });

