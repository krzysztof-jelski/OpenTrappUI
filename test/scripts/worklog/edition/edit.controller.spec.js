describe('EditModalCtrl', function () {

    beforeEach(module('openTrapp.worklog.edition'));

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

    it("cancels", function () {
        new EditModalCtrl(scope, modal, {}, []);

        scope.cancel();

        expect(modal.dismiss).toHaveBeenCalled();
    });

    it("posts", function () {

	var worklog = jasmine.createSpyObj("modal", ['refresh']);

        new EditModalCtrl(scope, modal, {id: "worklogId"}, [], http, worklog);
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
	expect(worklog.refresh).toHaveBeenCalled();
    });

});
