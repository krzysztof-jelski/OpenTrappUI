(function () {

    angular
        .module('openTrapp.report')
        .factory('workloadReports', function () {
            return {
                newReport: function () {
                    return new WorkloadReport();
                }
            };
        });

    function WorkloadReport() {
        var self = this;

        self.employees = employees;
        self.total = total;
        self.roundToHours = roundToHours;
        self.updateWorkload = updateWorkload;
        self.tag = tag;

        var employeesReport = {};
        var totalReport = {};
        var tagsReport = {};

        function employees() {
            return employeesReport;
        }

        function total() {
            return totalReport;
        }

        function roundToHours() {
            _(employeesReport).forEach(function (row) {
                updateMinutesToHoursOnRow(row);
            });
            updateMinutesToHoursOnRow(totalReport)
        }

        function updateMinutesToHoursOnRow(row) {
            _(row).forEach(function (minutes, column) {
                if (_.isNumber(minutes)) {
                    row[column] = minutesToHours(minutes);
                }
            });
        }

        function minutesToHours(minutes) {
            return (Math.round((minutes / 60) * 100) / 100).toString();
        }

        function updateWorkload(worklogEntry) {
            updateEmployeeWorkload(worklogEntry);
            updateTotalWorkload(worklogEntry);
        }

        function updateEmployeeWorkload(worklogEntry) {
            var rowName = worklogEntry.employee;
            updateRowWithWorkload(rowName, worklogEntry);
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

        function tag(employee, day) {
            return tagsReport[employee][day];
        }
    }

})();