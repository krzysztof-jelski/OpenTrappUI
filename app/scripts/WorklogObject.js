function Worklog($http) {

    var worklog = [];
    var listeners = [];
    this.http = $http;
    this.months = [];
    this.employees = {};
    this.projects = {};
    this.entries = [];

    var that = this;

    Worklog.prototype.setMonths = function (month,callback) {

        that.http.get('http://localhost:8080/endpoints/v1/calendar/' + month.join(',').replace(new RegExp('/', 'g'), '') + '/work-log/entries')
            .success(function (data) {
                if (data) {

                    that.months = _.map(month,function(m){
                        return {name:m}
                    });
                    var projects = {};
                    var employees = {};

                    worklog = data.items;

                    var statusOf = function (x) {
                        return _.isUndefined(x) ? {active: false} : {active: x.active};
                    };

                    _(worklog).pluck('projectNames').flatten().uniq().forEach(function(project){
                        projects[project] = statusOf(that.projects[project]);
                    });
                    _(worklog).pluck('employee').uniq().forEach(function (employee) {
                        employees[employee] = statusOf(that.employees[employee]);
                    });

                    _(that.projects).forEach(function (status, project) {
                        if (status.active && projects[project] == undefined) {
                            projects[project] = {hidden: true, active: true};
                        }
                    });

                    _(that.employees).forEach(function (status, employee) {
                        if (status.active && employees[employee] == undefined) {
                            employees[employee] = {hidden: true, active: true};
                        }
                    });

                    that.employees = employees;
                    that.projects = projects;

                    apply();
                    if (callback) {
                        callback();
                    }
                }
            });
    };

    Worklog.prototype.toggleProject = function (projectName) {
        if (_.isUndefined(that.projects[projectName])) {
            that.projects[projectName] = {active: true};
        } else {
            that.projects[projectName].active = !that.projects[projectName].active;
        }
        apply();
    };
    Worklog.prototype.toggleEmployee = function (employee) {

        if (_.isUndefined(that.employees[employee])) {
            that.employees[employee] = {active: true};
        } else {
            that.employees[employee].active = !that.employees[employee].active;
        }
        apply();
    };
    Worklog.prototype.enableEmployee = function (employee) {

        that.employees[employee] = {active: true};
        apply();
    };
    Worklog.prototype.enableAllEmployees = function () {
        _(that.employees).forEach(function (status) {
            status.active = true;
        });
        apply();
    };
    Worklog.prototype.disableAllEmployees = function () {
        _(that.employees).forEach(function (status) {
            status.active = false;
        });
        apply();
    };
    Worklog.prototype.enableProject = function (project) {

        that.projects[project] = {active: true};
        apply();
    };
    Worklog.prototype.enableAllProjects = function () {
        _(that.projects).forEach(function (status) {
            status.active = true;
        });
        apply();
    };
    Worklog.prototype.disableAllProjects = function () {
        _(that.projects).forEach(function (status) {
            status.active = false;
        });
        apply();
    };
    Worklog.prototype.enableEmployeeProjects = function (employee) {

        _(worklog).forEach(function(x){
            if(x.employee == employee){
                _(x.projectNames).forEach(function (project) {
                    that.enableProject(project);
                });
            }
        });
        apply();
    };
    Worklog.prototype.remove = function (id) {
        $http({method: 'DELETE', url: 'http://localhost:8080/endpoints/v1/work-log/entries/' + id})
            .success(function (data) {
                that.setMonths(_.pluck(that.months,'name'));
            });
    };
    Worklog.prototype.refresh = function () {
        that.setMonth(_.pluck(that.months,'name'));
        apply();
    };
    Worklog.prototype.reset = function () {
        that.months = [];
        that.employees = {};
        that.projects = {};
        that.entries = [];
    };
    Worklog.prototype.onUpdate = function (listener) {
        listeners.push(listener);
    };

    Worklog.prototype.monthsNames = function(){
        return _.pluck(that.months,'name');
    };
    Worklog.prototype.isForMonth = function(month){
        return _.contains(_.pluck(that.months,'name'),month);
    };
    Worklog.prototype.month = function(month){
        return _.findWhere(that.months, {'name':month});
    };

    var apply = function() {

        buildWorklog();
        calculateTotals();
        notifyListeners();
    };

    var buildWorklog = function(){

        that.entries = _(worklog)
            .filter(function(x){ return that.employees[x.employee].active })
            .filter(function(x) {
                return hasAnyProjectActive(x);
            })
            .value();
    };

    var calculateTotals = function(){

        var resetTotal = function(x){ x.total = new Workload(0); };
        var normalizeTotal = function(x){ x.total = x.total.print() };

        _(that.employees).forEach(resetTotal);
        _(that.projects).forEach(resetTotal);
        _(that.months).forEach(resetTotal);

        _(worklog).forEach(function(x){
            if(x.workload){
                var workload = new Workload(x.workload);
                if(that.employees[x.employee].active && hasAnyProjectActive(x)){
                    _.forEach(that.months,function(month){
                        var currentMonth = new RegExp(month.name);
                        if(currentMonth.test(x.day)){
                            month.total = month.total.add(workload);
                        }
                    });

                }
                if (hasAnyProjectActive(x)) {
                    that.employees[x.employee].total = that.employees[x.employee].total.add(workload);
                }
                if(that.employees[x.employee].active){
                    _(x.projectNames).forEach(function (project) {
                        that.projects[project].total = that.projects[project].total.add(workload);
                    });
                }
            }
        });

        _(that.months).forEach(normalizeTotal);
        _(that.employees).forEach(normalizeTotal);
        _(that.projects).forEach(normalizeTotal);
    };

    var notifyListeners = function(){
        _(listeners).forEach(function(listener){
            listener.call();
        });
    };

    function hasAnyProjectActive(worklog) {
        return _(worklog.projectNames).any(function (project) {
            return that.projects[project].active;
        });
    }
}