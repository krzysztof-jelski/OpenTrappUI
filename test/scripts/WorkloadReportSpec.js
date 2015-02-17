describe('Workload Report', function () {

    it("calculates total workload for whole report", function () {
        var workloadReport = new WorkloadReport();

        updateWithEntries(workloadReport,[
            {day: "2015/02/19", employee: "homer.simpson", workload: "30m"},
            {day: "2015/01/20", employee: "bart.simpson", workload: "30m"}
        ]);

        expect(workloadReport.total()['total']).toEqual(60);
    });


    it("calculates total workload for months", function () {
        var workloadReport = new WorkloadReport();

        updateWithEntries(workloadReport,[
            {day: "2015/01/20", employee: "homer.simpson", workload: "30m"},
            {day: "2015/01/21", employee: "bart.simpson", workload: "30m"},
            {day: "2015/02/19", employee: "homer.simpson", workload: "40m"}
        ]);

        expect(workloadReport.total()['2015/01']).toEqual(60);
        expect(workloadReport.total()['2015/02']).toEqual(40);
    });

    it("calculates total workload for every day for employee", function () {

        var workloadReport = new WorkloadReport();

        updateWithEntries(workloadReport,[
            {day: "2015/01/20", employee: "homer.simpson", workload: "30m"},
            {day: "2015/01/20", employee: "homer.simpson", workload: "40m"},
            {day: "2015/01/20", employee: "bart.simpson", workload: "30m"},
            {day: "2015/01/21", employee: "homer.simpson", workload: "30m"}
        ]);

        expect(workloadReport.employees()["homer.simpson"]["2015/01/20"]).toEqual(70);
    });

    it("calculates totals workload for every employee", function () {

        var workloadReport = new WorkloadReport();

        updateWithEntries(workloadReport,[
            {day: "2015/01/20", employee: "homer.simpson", workload: "30m"},
            {day: "2015/01/21", employee: "bart.simpson", workload: "30m"},
            {day: "2015/02/19", employee: "homer.simpson", workload: "40m"}
        ]);

        expect(workloadReport.employees()["homer.simpson"]["total"]).toEqual(70);
    });

    //TODO to be implemented
    it("calculates monthly total workload for every employee", function () {

        var workloadReport = new WorkloadReport();

        updateWithEntries(workloadReport,[
            {day: "2015/01/20", employee: "homer.simpson", workload: "30m"},
            {day: "2015/01/21", employee: "bart.simpson", workload: "30m"},
            {day: "2015/02/19", employee: "homer.simpson", workload: "40m"}
        ]);

        expect(workloadReport.employees()["homer.simpson"]["total"]["2015/01"]).toEqual(30);
    });


    function updateWithEntries(workloadReport,entries) {
        _.forEach(entries,function(entry){
            workloadReport.updateWorkload(entry);
        })
    }
});