angular
    .module('openTrapp.report')
    .controller('ReportController', function ($timeout, $state, worklog, currentMonth, currentEmployee, availableMonths) {
        var self = this;

        // used in Table Report
        self.sort = {
            predicate: 'day',
            reverse: true
        };

        // used in parent Report view
        self.months = [];
        self.currentMonth = undefined;
        self.nextVisibleMonth = nextVisibleMonth;
        self.prevVisibleMonth = prevVisibleMonth;
        self.display = reportType;

        // used in both parent Report view and Table Report
        self.worklog = worklog;

        var visibleMonth;

        worklog.reset();
        $timeout(setMonths, 600);

        function reportType() {
            return $state.$current.data.reportType;
        }

        function setMonths() {
            worklog.setMonth(currentMonth.name, function () {
                var employee = currentEmployee.username();
                worklog.enableEmployee(employee);
                worklog.enableEmployeeProjects(employee);

            });
            self.months = availableMonths.get(currentMonth);
            self.currentMonth = currentMonth;
            visibleMonth = currentMonth;
        }

        function nextVisibleMonth() {
            visibleMonth = visibleMonth.next();
            self.months = availableMonths.get(visibleMonth);
        }

        function prevVisibleMonth() {
            visibleMonth = visibleMonth.prev();
            self.months = availableMonths.get(visibleMonth);
        }

    });