var WorkloadReport = function() {
    var report = {};
    this.updateWorkload = function (worklogEntry) {
        updateEmployeeWorkload(worklogEntry);
        updateTotalWorkload(worklogEntry);
    };

    this.json = function() {
        return  report;
    };

    this.roundToHours = function() {
        _(report).forEach(function (employee) {
            _(employee).forEach(function (minutes, day) {
                employee[day] = minutesToHours(minutes);
            });
        });
    };

    function minutesToHours(minutes){
        return (Math.round((minutes/60)*100)/100).toString();
    }

    function updateEmployeeWorkload(worklogEntry) {
        var rowName = worklogEntry.employee;
        updateRowWithWorkload(rowName, worklogEntry);
    }

    function updateTotalWorkload(worklogEntry) {
        updateRowWithWorkload('Total', worklogEntry);
    }

    function addWorkloadToCell(row, column, workload) {
        var currentWorkload = (row[column] || 0);
        row[column] = currentWorkload + workload;
    }

    function updateRowWithWorkload(key, worklogEntry) {
        var row = report[key] || {};

        var minutes = new Workload(worklogEntry.workload).minutes;
        addWorkloadToCell(row, worklogEntry.day, minutes);
        addWorkloadToCell(row, 'total', minutes);

        report[key] = row;
    }
};
