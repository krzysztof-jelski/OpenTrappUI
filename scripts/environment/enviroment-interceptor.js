angular
    .module('openTrapp.environment', [])
    .factory('enviromentInterceptor', function ($cookies) {

        return {

            request: function (config) {

                // FIXME: create placeholder and write tests

                if (!$cookies.get('apiServerUrl')) {
                    $cookies.put('apiServerUrl', "open-trapp.herokuapp.com");
                }
                config.url = config.url.replace('localhost:8080', $cookies.get('apiServerUrl'));

                return config;
            },
            response: function (config) {
                return config;
            }
        };

    })
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('enviromentInterceptor');
    });
