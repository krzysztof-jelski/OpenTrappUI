describe('Report Filters Controller', function () {

    beforeEach(module('openTrapp.report'));

    var currentMonth;
    var currentEmployee;
    var scope, worklog, $controller;
    var worklogIsReady;
    var timeout;
    var availableMonths;

    beforeEach(inject(function (Month) {
        currentMonth = new Month('2014/01');
        worklogIsReady = function () {
        };
    }));
    beforeEach(inject(function ($rootScope, _$controller_, $timeout, _worklog_, _currentEmployee_, _availableMonths_) {
        availableMonths = _availableMonths_;
        scope = $rootScope.$new();
        $controller = _$controller_;
        timeout = $timeout;

        currentEmployee = _currentEmployee_;
        worklog = _worklog_;
        spyOn(worklog, 'setMonth').and.callFake(function (m, callback) {
            worklogIsReady = callback;
        });
        spyOn(worklog, 'enableEmployee');
        spyOn(worklog, 'enableEmployeeProjects');
    }));

    it('starts with current month', function () {

        // given:
        // when:
        createReportControllerWithTimeout();

        // then:
        expect(worklog.setMonth).toHaveBeenCalledWith(currentMonth.name, worklogIsReady);
    });

    it('setups months from service', function () {
        // given:
        spyOn(availableMonths, 'get').and.returnValue(['2014/02', '2014/01']);

        // when:
        var controller = createReportControllerWithTimeout();

        // then:
        expect(controller.months).toEqual(['2014/02', '2014/01']);
    });

    it('selects current user by default', function () {

        // given:
        currentEmployeeIs('bart.simpson');
        createReportControllerWithTimeout();

        // when:
        worklogIsReady();

        // then:
        expect(worklog.enableEmployee).toHaveBeenCalledWith('bart.simpson');
    });

    it('selects current users projects by default', function () {

        // given:
        currentEmployeeIs('bart.simpson');
        createReportControllerWithTimeout();

        // when:
        worklogIsReady();

        // then:
        expect(worklog.enableEmployeeProjects).toHaveBeenCalledWith('bart.simpson');
    });

    function currentEmployeeIs(employee) {
        currentEmployee.signedInAs(employee);
    }

    function createReportControllerWithTimeout() {
        var controller = $controller('ReportController', {
            $scope: scope,
            currentMonth: currentMonth,
            timeout: timeout
        });
        timeout.flush();
        return controller;
    }

});
