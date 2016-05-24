describe('EditModalCtrl', function () {

    beforeEach(module('openTrapp.worklog'));

    var httpBackend, scope, modal, $controller;

    beforeEach(inject(function ($httpBackend, $rootScope, _$controller_) {
        httpBackend = $httpBackend;
        scope = $rootScope.$new();
        modal = jasmine.createSpyObj("modal", ["close", 'dismiss']);
        $controller = _$controller_;
    }));

    it("initializes", function () {
        var item = {id: "someId"};

        $controller('EditModalCtrl', {
            $scope: scope,
            $uibModalInstance: modal,
            item: item
        });

        expect(scope.item).toEqual(item);
        expect(scope.item).not.toBe(item);
    });

    it("cancels", function () {
        $controller('EditModalCtrl', {
            $scope: scope,
            $uibModalInstance: modal,
            item: {}
        });

        scope.cancel();

        expect(modal.dismiss).toHaveBeenCalled();
    });

    it("posts", function () {

        var worklog = jasmine.createSpyObj("modal", ['refresh']);

        $controller('EditModalCtrl', {
            $scope: scope,
            $uibModalInstance: modal,
            item: {id: "worklogId"},
            worklog: worklog
        });
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
