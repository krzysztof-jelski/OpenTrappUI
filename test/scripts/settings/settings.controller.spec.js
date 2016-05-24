describe("Settings", function () {

    beforeEach(module('openTrapp.settings'));

    var scope, cookies;

    beforeEach(inject(function ($rootScope, $controller, $cookies) {
        scope = $rootScope.$new();
        $controller('SettingsController', {
            $scope: scope
        });
        cookies = $cookies;
        cookies.remove('apiServerUrl');
    }));

    it('loads serverUrl from cookies', function () {

        cookies.put('apiServerUrl', 'http://api.open-trapp.com');

        scope.init();

        expect(scope.apiServerUrl).toEqual('http://api.open-trapp.com');

    });

    it('loads default serverUrl', function () {

        scope.init();

        expect(scope.apiServerUrl).toEqual('http://open-trapp.herokuapp.com');
    });

    it('stores serverUrl to cookies on save', function () {

        scope.init();
        scope.apiServerUrl = 'http://test-api.open-trapp.com';

        scope.save();

        expect(cookies.get('apiServerUrl')).toEqual('http://test-api.open-trapp.com');
    });

    it('restores last serverUrl on cancel', function () {

        cookies.put('apiServerUrl', 'http://api.open-trapp.com');
        scope.init();

        scope.apiServerUrl = 'http://test-api.open-trapp.com';
        scope.cancel();

        expect(scope.apiServerUrl).toEqual('http://api.open-trapp.com');
    });

});
