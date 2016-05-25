describe('Pie Chart Report Controller', function () {

    beforeEach(module('openTrapp.report'));

    var $controller;
    var $rootScope;
    var worklog;
    var worklogUpdated;

    beforeEach(function () {
        worklogUpdated = function () {
        };
    });

    beforeEach(inject(function (_$rootScope_, _$controller_) {
        worklog = {
            projects: {},
            onUpdate: function (callback) {
                worklogUpdated = callback;
            }
        };
        $rootScope = _$rootScope_;
        $controller = _$controller_;
    }));

    it("calculates share for active project", function () {

        // given:
        worklog.projects = {
            "ProjectManhattan": {
                active: true,
                total: "1h"
            },
            "ApolloProgram": {
                active: true,
                total: "2h"
            },
            "OtherProject": {
                active: false,
                total: "1h"
            }
        };

        // when:
        var report = newPercentageReportController();

        // then:
        expect(report.projects).toEqual([
            {name: "ApolloProgram", total: "2h", share: "67%"},
            {name: "ProjectManhattan", total: "1h", share: "33%"}
        ]);
    });

    it("recalculates share on workload update", function () {

        // given:
        worklog.projects = {};
        var report = newPercentageReportController();

        // when:
        worklog.projects = {
            "ProjectManhattan": {
                active: true,
                total: "1h"
            }
        };
        worklogUpdated();

        // then:
        expect(report.projects).toEqual([
            {name: "ProjectManhattan", total: "1h", share: "100%"}
        ]);
    });

    function newPercentageReportController() {
        return $controller('PercentageReportController', {
            $scope: $rootScope.$new(),
            worklog: worklog
        });
    }

});