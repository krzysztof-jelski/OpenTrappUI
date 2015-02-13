describe('Worklogs', function() {

    var httpBackend,worklogsProvider;

    beforeEach(module('openTrapp'));

    beforeEach(inject(function($httpBackend,_worklogsProvider_) {
        httpBackend = $httpBackend;
        worklogsProvider = _worklogsProvider_;
        console.log(_worklogsProvider_);
    }));

    it("calculates total for months", function () {
        httpBackend
            .whenGET('http://open-trapp.herokuapp.com/endpoints/v1/calendar/2015/01/work-log/entries')
            .respond(200, { items: [
                { projectNames: ['ProjectManhattan'],workload:20 },
                { projectNames: ['ApolloProgram'], workload:30 }
            ] });

        var worklogs = worklogsProvider;
        worklogs.setMonths(["2015/01"]);

        var total = worklogs.total(["2015/01"]);
        httpBackend.flush();

        expect(total).toEqual(10);
    });

});