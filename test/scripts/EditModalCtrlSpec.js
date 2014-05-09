describe('EditModalCtrl', function () {

    beforeEach(module('openTrapp'));
    beforeEach(inject(function(_enviromentInterceptor_){
        _enviromentInterceptor_.request = function(x){
            return x;
        };
    }));

    var http, httpBackend, scope, modal;

    beforeEach(inject(function ($httpBackend, $http, $rootScope) {
        httpBackend = $httpBackend;
        http = $http;
        scope = $rootScope.$new();
        modal = jasmine.createSpyObj("modal", ["close", 'dismiss']);
    }));

    it("initializes", function () {
        var item = {id: "someId"};

        new EditModalCtrl(scope, modal, item, ['pr1', 'pr2']);

        expect(scope.item).toEqual(item);
        expect(scope.item).not.toBe(item);
    });

    it("suggests", function () {
        new EditModalCtrl(scope, modal, {}, ['angular', 'angel', 'antler']);

        scope.item.projectName = "ang";
        scope.$digest();

        expect(scope.suggestions).toEqual(['angular', 'angel']);
    });

    it("cancels", function () {
        new EditModalCtrl(scope, modal, {}, []);

        scope.cancel();

        expect(modal.dismiss).toHaveBeenCalled();
    });

    it("posts", function () {
        new EditModalCtrl(scope, modal, {id: "worklogId"}, [], http);
        scope.item.workload = "some workload";
        scope.item.projectName = "Project Manhattan";
        httpBackend.expectPOST("http://localhost:8080/endpoints/v1/work-log/entries/worklogId",
            {workload: "some workload", projectName: "Project Manhattan"}).respond(200);

        scope.ok();
        httpBackend.flush();

        expect(modal.close).toHaveBeenCalledWith({
            type: 'success',
            message: 'Worklog updated'
        });
    });

});
