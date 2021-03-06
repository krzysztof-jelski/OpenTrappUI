angular
    .module('openTrapp.report')
    .controller('PercentageReportController', function ($document, worklog) {
        var self = this;

        var colors = ['88', 'AA', 'CC'];
        var chartObject = false;

        self.projects = [];
        self.colorFor = colorFor;

        recreateReport();
        worklog.onUpdate(recreateReport);

        function recreateReport() {
            calculateShares();
            // FIXME pie chart has no sense for multiple project tags (sum over 100%)
            // updateChart();
        }

        function calculateShares() {

            var projects = [];

            var total = 0;
            _(worklog.projects).forEach(function (status, projectName) {
                if (status.active)
                    total += new Workload(status.total).minutes;
            });

            _(worklog.projects).forEach(function (status, projectName) {
                var project = new Workload(worklog.projects[projectName].total).minutes;
                if (status.active) {
                    projects.push({
                        name: projectName,
                        total: status.total,
                        share: total === 0 ? "n/a" : Math.round(project / total * 100) + "%"
                    });
                }
            });

            self.projects = _(projects).sortBy(function (x) {
                return -(new Workload(x.total).minutes);
            }).value();
        }

        function hashCode(str) {
            var hash = 0;
            if (str.length === 0) return hash;
            for (var i = 0; i < str.length; i++) {
                var character = str.charCodeAt(i);
                hash = ((hash << 7) - hash) + character;
                hash = hash & hash;
            }
            return hash;
        }

        function colorFor(project) {

            var num = Math.abs((hashCode(project)) % 27);
            var c1 = Math.floor(num / 9);
            var c2 = Math.floor((num - c1 * 9) / 3);
            var c3 = num % 3;

            return '#' + colors[c1] + colors[c2] + colors[c3];
        }

        function updateChart() {

            var chartElement = $document.getElementById("projectShare");

            if (!chartElement) {
                return;
            }

            var ctx = chartElement.getContext("2d");
            var data = [];

            _(self.projects).forEach(function (p) {
                var share = new Workload(p.total).minutes;
                data.push({
                    value: share,
                    color: self.colorFor(p.name),
                    label: p.name
                });
            });

            if (!chartObject) {
                chartObject = new Chart(ctx);
            }

            var chart = chartObject.Doughnut(data, {
                animationEasing: "easeOutQuart"
            });
        }

    });
