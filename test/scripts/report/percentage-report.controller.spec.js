describe('Pie Chart Report Controller', function () {

    beforeEach(module('openTrapp.report'));

    var $controller;
    var scope;
    var worklog;
    var worklogUpdated;

    beforeEach(function () {
        worklogUpdated = function () {
        };
    });

    beforeEach(inject(function ($rootScope, _$controller_) {
        worklog = {
            projects: {},
            onUpdate: function (callback) {
                worklogUpdated = callback;
            }
        };
        scope = $rootScope.$new();
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
        newPercentageReportController();

        // then:
        expect(scope.projects).toEqual([
            {name: "ApolloProgram", total: "2h", share: "67%"},
            {name: "ProjectManhattan", total: "1h", share: "33%"}
        ]);
    });

    it("recalculates share on workload update", function () {

        // given:
        worklog.projects = {};
        newPercentageReportController();

        // when:
        worklog.projects = {
            "ProjectManhattan": {
                active: true,
                total: "1h"
            }
        };
        worklogUpdated();

        // then:
        expect(scope.projects).toEqual([
            {name: "ProjectManhattan", total: "1h", share: "100%"}
        ]);
    });

    function newPercentageReportController() {
        $controller('PercentageReportController', {
            $scope: scope,
            worklog: worklog
        });
    }

});