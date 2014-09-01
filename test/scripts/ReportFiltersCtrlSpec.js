describe('Report Filters Controller', function () {

    beforeEach(module('openTrapp'));

    var currentMonth;
    var currentEmployee;
    var scope, worklog;
    var worklogIsReady;
    var timeout;

    beforeEach(function () {
        currentMonth = new Month('2014/01');
        worklogIsReady = function () {
        };
    });
    beforeEach(inject(function ($rootScope, $controller, $timeout, _worklog_, _currentEmployee_) {

        scope = $rootScope.$new();
        $controller('ReportFiltersCtrl', {
            $scope: scope,
            currentMonth: currentMonth,
            timeout: $timeout
        });
        timeout = $timeout;

        currentEmployee = _currentEmployee_;
        worklog = _worklog_;
        spyOn(worklog, 'setMonth').and.callFake(function (m, callback) {
            worklogIsReady = callback;
        });
        spyOn(worklog, 'enableEmployee');
        spyOn(worklog, 'enableEmployeeProjects');
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
        expect(worklog.setMonth).toHaveBeenCalledWith(currentMonth.name, worklogIsReady);
    });

    it('offers one next month, current month and 11 previous months', function () {

        // given:
        // when:
        initScopeWithTimeout();

        // then:
        expect(scope.months).toEqual(['2014/02', '2014/01', '2013/12', '2013/11', '2013/10', '2013/09', '2013/08', '2013/07', '2013/06',
					'2013/05', '2013/04', '2013/03', '2013/02']);
    });

    it('selects current user by default', function () {

        // given:
        currentEmployeeIs('bart.simpson');
        initScopeWithTimeout();

        // when:
        worklogIsReady();

        // then:
        expect(worklog.enableEmployee).toHaveBeenCalledWith('bart.simpson');
    });

    it('selects current users projects by default', function () {

        // given:
        currentEmployeeIs('bart.simpson');
        initScopeWithTimeout();

        // when:
        worklogIsReady();

        // then:
        expect(worklog.enableEmployeeProjects).toHaveBeenCalledWith('bart.simpson');
    });

    // --

    var currentEmployeeIs = function (employee) {
        currentEmployee.signedInAs(employee);
    };

});
