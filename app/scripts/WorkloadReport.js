var WorkloadReport = function() {
    var employeesReport = {};
    var totalReport = {};
    this.updateWorkload = function (worklogEntry) {
        updateEmployeeWorkload(worklogEntry);
        updateTotalWorkload(worklogEntry);
    };

    this.total = function() {
        return totalReport;
    };

    this.employees = function() {
        return employeesReport;
    };

    function updateMinutesToHoursOnRow(row) {
        _(row).forEach(function (minutes, column) {
            row[column] = minutesToHours(minutes);
        });
    }

    this.roundToHours = function() {
        _(employeesReport).forEach(function (row) {
            updateMinutesToHoursOnRow(row);
        });
        updateMinutesToHoursOnRow(totalReport)
    };

    function minutesToHours(minutes){
        return (Math.round((minutes/60)*100)/100).toString();
    }

    function updateEmployeeWorkload(worklogEntry) {
        var rowName = worklogEntry.employee;
        updateRowWithWorkload(rowName, worklogEntry);
    }

    function updateTotalWorkload(worklogEntry) {
        var minutes = new Workload(worklogEntry.workload).minutes;
        addWorkloadToCell(totalReport, worklogEntry.day, minutes);
        addWorkloadToCell(totalReport, 'total', minutes);

        updateTotalsForMonths(totalReport,worklogEntry,minutes);
    }

    function updateTotalsForMonths(totalReport, worklogEntry, minutes) {
        var yearMonthRegexp = /\d{4}[\/]\d{2}/;
        var worklogMonth = yearMonthRegexp.exec(worklogEntry.day);

        addWorkloadToCell(totalReport, worklogMonth, minutes);
    }

    function addWorkloadToCell(row, column, workload) {
        var currentWorkload = (row[column] || 0);
        row[column] = currentWorkload + workload;
    }

    function updateRowWithWorkload(key, worklogEntry) {
        var row = employeesReport[key] || {};

        var minutes = new Workload(worklogEntry.workload).minutes;
        addWorkloadToCell(row, worklogEntry.day, minutes);
        addWorkloadToCell(row, 'total', minutes);

        employeesReport[key] = row;
    }
};
