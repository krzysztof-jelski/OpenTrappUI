function Worklogs($http) {
    var worklogs = [];
    var http = $http;

    Worklogs.prototype.setMonths = function (months) {
        //TODO fetch data for all moths in one shot

        _.forEach(months, function (month) {
            var worklog = new Worklog(http);
            worklog.setMonth(month);
            worklogs.push(worklog)
        })
    };



    Worklogs.prototype.enableEmployee = function (employee) {
        _.forEach(worklogs, function (worklog) {
            worklog.enableEmployee(employee);
        });

    };

    Worklogs.prototype.enableEmployeeProjects = function (employee) {
        _.forEach(worklogs, function (worklog) {
            worklog.enableEmployeeProjects(employee);
        });
    };

    Worklogs.prototype.total = function (months) {

        return _(worklogs)
            .filter(function(worklog){return _(months).contains(worklog.month)})
            .reduce(function(sum, n) { return sum + n; })

    };

    Worklogs.prototype.worklogs = function () {
        return worklogs;
    };

    Worklogs.prototype.areForMonth = function (month) {

        return _(worklogs).pluck('month').contains(month);
    };
}