angular
    .module('openTrapp.worklog')
    .factory('projectNames', function ($q, $http) {

        var cachedProjectNames;

        return {
            loadAllStartingWith: loadAllStartingWith
        };

        function loadAllStartingWith(prefix) {
            return loadProjectNamesFromCache()
                .catch(loadProjectNamesFromServer)
                .then(updateCache)
                .then(function (projectNames) {
                    return _(projectNames)
                        .filter(function (projectName) {
                            return projectName.indexOf(prefix) === 0;
                        })
                        .value();
                });
        }

        function loadProjectNamesFromCache() {
            if (cachedProjectNames) {
                return $q.resolve(cachedProjectNames);
            }
            return $q.reject();
        }

        function loadProjectNamesFromServer() {
            return $http.get('http://localhost:8080/endpoints/v1/projects/')
                .then(function (response) {
                    return response.data;
                });
        }

        function updateCache(projectNames) {
            cachedProjectNames = projectNames;
            return projectNames;
        }

    });
