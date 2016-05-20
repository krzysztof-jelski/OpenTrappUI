angular
    .module('openTrapp.worklog')
    .factory('projectNames', function ($http) {

        var cached;

        return projectNamesWithPrefix('');

        function projectNamesWithPrefix(prefix) {

            return {
                startingWith: startingWith,
                forEach: forEach
            };

            function startingWith(prefix) {
                return projectNamesWithPrefix(prefix);
            }

            function loadAllProjectNames() {
                if (!cached) {
                    var promise = $http.get('http://localhost:8080/endpoints/v1/projects/');
                    promise.then(function (x) {
                        cached = x;
                    });
                    return promise;
                }
                return {
                    then: function (callback) {
                        callback(cached);
                    }
                };
            }

            function forEach(callback) {
                loadAllProjectNames()
                    .then(function (response) {
                        var projectNames = response.data;
                        _(projectNames).filter(function (x) {
                            return x.indexOf(prefix) === 0;
                        }).forEach(callback);
                    });
            }
        }
    });
