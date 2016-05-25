describe("SignIn", function () {

    beforeEach(module('openTrapp.authentication'));

    var $controller, scope, httpBackend, currentEmployee, location;

    beforeEach(inject(function (_$controller_, $rootScope, $httpBackend, $location, _currentEmployee_) {
        $controller = _$controller_;
        scope = $rootScope.$new();
        httpBackend = $httpBackend;
        location = $location;
        currentEmployee = _currentEmployee_;
        spyOn(currentEmployee, 'signedInAs');
    }));

    it('gets authentication status', function () {
        // given
        httpBackend.expectGET("http://localhost:8080/endpoints/v1/authentication/status").respond(200, {
            "authenticated": true,
            "displayName": "Homer Simpson",
            "username": "homer.simpson",
            "loginUrl": "/loginUrl",
            "logoutUrl": "/logoutUrl"
        });
        spyOn(location, 'absUrl').and.returnValue('currentLocation');

        // when
        var controller = newSignInController();
        httpBackend.flush();

        // then
        expect(controller.authenticated).toEqual(true);
        expect(controller.unauthenticated).toEqual(false);
        expect(controller.displayName).toEqual("Homer Simpson");
        expect(controller.username).toEqual("homer.simpson");
        expect(controller.loginUrl).toEqual("/loginUrl?redirect_to=currentLocation");
        expect(controller.logoutUrl).toEqual("/logoutUrl?redirect_to=currentLocation");
    });

    it('sets currentEmployee', function () {
        // given
        httpBackend.expectGET("http://localhost:8080/endpoints/v1/authentication/status").respond(200, {
            "authenticated": true,
            "displayName": "Homer Simpson",
            "username": "homer.simpson",
            "loginUrl": "/loginUrl",
            "logoutUrl": "/logoutUrl"
        });

        // when
        newSignInController();
        httpBackend.flush();

        // then
        expect(currentEmployee.signedInAs).toHaveBeenCalledWith('homer.simpson');
    });

    function newSignInController() {
        return $controller('SignInController', {
            $scope: scope
        });
    }

});
