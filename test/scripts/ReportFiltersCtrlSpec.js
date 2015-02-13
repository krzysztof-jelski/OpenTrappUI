describe('Report Filters Controller', function () {

    beforeEach(module('openTrapp'));

    var currentMonth;
    var currentEmployee;
    var scope, worklog, worklogs;
    var worklogIsReady;
    var timeout;
    var availableMonths;

    beforeEach(function () {
        currentMonth = new Month('2014/01');
        worklogIsReady = function () {
        };
    });
    beforeEach(inject(function ($rootScope, $controller, $timeout, _worklog_, _currentEmployee_, _availableMonths_,_worklogsProvider_) {
        availableMonths = _availableMonths_;
        scope = $rootScope.$new();
        $controller('ReportFiltersCtrl', {
            $scope: scope,
            currentMonth: currentMonth,
            timeout: $timeout
        });
        timeout = $timeout;

        currentEmployee = _currentEmployee_;
        worklog = _worklog_;
        worklogs = _worklogsProvider_;
        spyOn(worklogs, 'setMonths').and.callFake(function (m, callback) {
            worklogIsReady = callback;
        });
        spyOn(worklogs, 'enableEmployee');
        spyOn(worklogs, 'enableEmployeeProjects');
    }));

    function initScopeWithTimeout() {
        scope.init();
        timeout.flush();
    }

    it('starts with current month', function () {

        // given:
        // when:
        initScopeWithTimeout();

        // then:
        expect(worklogs.setMonths).toHaveBeenCalledWith(currentMonth.name, worklogIsReady);
    });

    it('setups months from service', function () {
        // given:
        spyOn(availableMonths, 'get').and.returnValue(['2014/02','2014/01']);

        // when:
        initScopeWithTimeout();

        // then:
        expect(scope.months).toEqual(['2014/02','2014/01']);
    });

    it('selects current user by default', function () {

        // given:
        currentEmployeeIs('bart.simpson');
        initScopeWithTimeout();

        // when:
        worklogIsReady();

        // then:
        expect(worklogs.enableEmployee).toHaveBeenCalledWith('bart.simpson');
    });

    it('selects current users projects by default', function () {

        // given:
        currentEmployeeIs('bart.simpson');
        initScopeWithTimeout();

        // when:
        worklogIsReady();

        // then:
        expect(worklogs.enableEmployeeProjects).toHaveBeenCalledWith('bart.simpson');
    });

    // --

    var currentEmployeeIs = function (employee) {
        currentEmployee.signedInAs(employee);
    };

});
