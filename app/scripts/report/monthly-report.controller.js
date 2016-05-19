(function () {

    angular
        .module('openTrapp.report')
        .controller('MonthlyReportCtrl', function ($scope, worklog, $http) {

            var currentMonth = null;
            $scope.days = [];
            $scope.report = {};
            $scope.init = function () {
                worklog.onUpdate(function () {
                    fetchDays();
                    calculateDays();
                });
            };

            $scope.satisfies = function () {
                return false;
            };

            var fetchDays = function () {

                if (currentMonth && currentMonth.valueOf() === worklog.month.valueOf()) {
                    return;
                } else {
                    currentMonth = worklog.month;
                }

                $http.get('http://localhost:8080/endpoints/v1/calendar/' + worklog.month).success(function (data) {
                    $scope.days = _(data.days).map(function (d) {

                        var m = moment(d.id, 'YYYY/MM/DD');

                        return {
                            id: d.id,
                            number: m.format('DD'),
                            name: m.format('ddd'),
                            holiday: d.holiday
                        }
                    }).value();
                });
            };

            var calculateDays = function () {
                $scope.report = new WorkloadReport();

                _(worklog.entries).forEach(function (worklogEntry) {
                    $scope.report.updateWorkload(worklogEntry);
                });
                $scope.report.roundToHours();
            };
        });

    function WorkloadReport() {
        var employeesReport = {};
        var tagsReport = {};
        var totalReport = {};
        this.updateWorkload = function (worklogEntry) {
            updateEmployeeWorkload(worklogEntry);
            updateTotalWorkload(worklogEntry);
        };

        this.total = function () {
            return totalReport;
        };

        this.employees = function () {
            return employeesReport;
        };

        this.tag = function (employee, day) {
            return tagsReport[employee][day];
        };

        function updateMinutesToHoursOnRow(row) {
            _(row).forEach(function (minutes, column) {
                if (_.isNumber(minutes)) {
                    row[column] = minutesToHours(minutes);
                }
            });
        }

        this.roundToHours = function () {
            _(employeesReport).forEach(function (row) {
                updateMinutesToHoursOnRow(row);
            });
            updateMinutesToHoursOnRow(totalReport)
        };

        function minutesToHours(minutes) {
            return (Math.round((minutes / 60) * 100) / 100).toString();
        }

        function updateEmployeeWorkload(worklogEntry) {
            var rowName = worklogEntry.employee;
            updateRowWithWorkload(rowName, worklogEntry);
        }

        function updateTotalWorkload(worklogEntry) {
            var minutes = new Workload(worklogEntry.workload).minutes;
            addWorkloadToCell(totalReport, worklogEntry.day, minutes);
            addWorkloadToCell(totalReport, 'total', minutes);
        }

        function addWorkloadToCell(row, column, workload) {
            var currentWorkload = (row[column] || 0);
            row[column] = currentWorkload + workload;
        }

        function addTagsToCell(row, column, tags) {
            var currentTags = (row[column] || {});
            _(tags).forEach(function (t) {
                currentTags['tag-' + t] = 1;
            });
            row[column] = currentTags;
        }

        function updateRowWithWorkload(key, worklogEntry) {
            var row = employeesReport[key] || {};
            var tags = tagsReport[key] || {};

            var minutes = new Workload(worklogEntry.workload).minutes;
            addWorkloadToCell(row, worklogEntry.day, minutes);
            addWorkloadToCell(row, 'total', minutes);
            addTagsToCell(tags, worklogEntry.day, worklogEntry.projectNames);

            employeesReport[key] = row;
            tagsReport[key] = tags;
        }
    };

})();