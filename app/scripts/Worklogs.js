function Worklogs($http) {
    var worklogs = [];
    var http = $http;

    Worklogs.prototype.setMonths = function (months) {
        //TODO fetch data for all moths in one shot

        _.forEach(months, function (month) {
            worklogs = [];
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
        return _.reduce(worklogs,function(sum, worklog) { return sum + worklog.month.total.minutes; })

    };

    Worklogs.prototype.reset = function () {
        _.forEach(worklogs, function (worklog) {
            worklog.reset();
        });
    };

    Worklogs.prototype.worklogs = function () {
        return worklogs;
    };


    Worklogs.prototype.projects = function () {
        var projects = {};
        _.forEach(worklogs,function(w){
            projects = _.extend(projects, w.projects);
        });
        return projects;
    };

    Worklogs.prototype.employees = function () {
        var employees = {};
        _.forEach(worklogs,function(w){
            employees = _.extend(employees, w.employees);
        });
        return employees;
    };

    Worklogs.prototype.toggleProject = function (projectName) {
        _(worklogs).forEach(function(worklog){
            worklog.toggleProject(projectName);
        })
    };

    Worklogs.prototype.toggleEmployee = function (employee) {
        _(worklogs).forEach(function(worklog){
            worklog.toggleEmployee(employee);
        })
    };

    Worklogs.prototype.areForMonth = function (month) {
        return _(worklogs).pluck('month').pluck('name').contains(month);
    };
}