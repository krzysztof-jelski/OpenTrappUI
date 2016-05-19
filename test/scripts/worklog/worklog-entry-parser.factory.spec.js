describe('WorkLogEntry Parser should', function () {
    beforeEach(module('openTrapp.worklog'));

    var timeProvider;
    var worklogEntryParser;
    var currentDateString = "2014/01/02";
    var currentWeekdayString = "thursday";
    var yesterdayDateString = "2014/01/01";
    var tomorrowDateString = "2014/01/03";
    var mondayBeforeTodayString = "2013/12/30";
    var fridayBeforeTodayString = "2013/12/27";
    var mondayAfterTodayString = "2014/01/06";
    var weekBeforeTodayString = "2013/12/26";
    var weekAfterTodayString = "2014/01/09";
    var someWorkload = '1d 1h 1m';
    var someProject = 'ProjectManhattan';
    var someDate = '2013/02/01';

    beforeEach(inject(function (_worklogEntryParser_, _timeProvider_) {
        timeProvider = _timeProvider_;
        worklogEntryParser = _worklogEntryParser_;
        spyOn(timeProvider, 'getCurrentDate').and.returnValue(new Date(currentDateString));
    }));

    it('parse full worklog', function () {
        var workLogExpression = '2h #ProjectManhattan @2014/01/03';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression)).toEqual(
            {
                projectNames: ['ProjectManhattan'],
                workload: '2h',
                day: '2014/01/03'
            }
        );
    });

    it('parse worklog for current day', function () {
        var workLogExpression = '2h #ProjectManhattan';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(currentDateString);
    });

    it('parse worklog for monday', function () {
        var workLogExpression = '2h #ProjectManhattan @monday';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(mondayBeforeTodayString);
    });

    it('parse worklog for weekday with upper letter', function () {
        var workLogExpression = '2h #ProjectManhattan @Monday';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(mondayBeforeTodayString);
    });

    it('parse worklog for friday', function () {
        var workLogExpression = '2h #ProjectManhattan @friday';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(fridayBeforeTodayString);
    });

    it('parse worklog for last monday', function () {
        var workLogExpression = '2h #ProjectManhattan @last-monday';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(mondayBeforeTodayString);
    });

    it('parse worklog for next monday', function () {
        var workLogExpression = '2h #ProjectManhattan @next-monday';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(mondayAfterTodayString);
    });

    it('parse worklog for weekday exactly week before today', function () {
        var workLogExpression = '2h #ProjectManhattan @last-thursday';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(weekBeforeTodayString);
    });

    it('parse worklog for weekday exactly week after today', function () {
        var workLogExpression = '2h #ProjectManhattan @next-thursday';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(weekAfterTodayString);
    });

    it('parse worklog for yesterday', function () {
        var workLogExpression = '2h #ProjectManhattan @yesterday';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(yesterdayDateString);
    });

    it('parse worklog for today', function () {
        var workLogExpression = '2h #ProjectManhattan @today';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(currentDateString);
    });

    it('parse worklog for today if given weekday', function () {
        var workLogExpression = '2h #ProjectManhattan @' + currentWeekdayString;

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(currentDateString);
    });

    it('parse worklog for tomorrow', function () {
        var workLogExpression = '2h #ProjectManhattan @tomorrow';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(tomorrowDateString);
    });

    it('parse worklog for yesterday by t-1', function () {
        var workLogExpression = '2h #ProjectManhattan @t-1';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(yesterdayDateString);
    });

    it('parse worklog for tomorrow by t+1', function () {
        var workLogExpression = '2h #ProjectManhattan @t+1';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(tomorrowDateString);
    });

    it('parse worklog with days and hours', function () {
        var workLogExpression = '1d 3h #ProjectManhattan';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).workload).toEqual("1d 3h");
    });

    it('parse worklog with days and hours', function () {
        var workLogExpression = '1d 5h 15m #ProjectManhattan';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).workload).toEqual("1d 5h 15m");
    });

    it('parse worklog for 1d by default', function () {
        var workLogExpression = '#ProjectManhattan';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).workload).toEqual("1d");
    });

    it('not parse worklog for invalid date', function () {
        var workLogExpression = '#ProjectManhattan @invalid';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(false);
    });

    it('not parse worklog for invalid text', function () {
        var workLogExpression = 'invalid';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(false);
    });

    it("not parse worklog for fractions", function () {
        var workLogExpression = '1,5h #ProjectMangattan';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(false);
    });

    it('not parse empty project', function () {
        var workLogExpression = '#';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(false);
    });

    it('not parse workload at the end of project name', function () {
        var workLogExpression = '#project2d';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).workload).toEqual("1d");
        expect(worklogEntryParser.parse(workLogExpression).projectNames).toEqual(["project2d"]);
    });

    it('parse worklog with hyphen in project for today', function () {
        var workLogExpression = '2h #Project-Manhattan';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).projectNames).toEqual(["Project-Manhattan"]);
    });

    it('not parse worklog with double day info', function () {
        var workLogExpression = '#Project-Manhattan @monday @tuesday';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(false);
        expect(worklogEntryParser.parse(workLogExpression)).toEqual(undefined);
    });

    it('not parse worklog with double workload hours info', function () {
        var workLogExpression = '2h 3h #Project-Manhattan';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(false);
        expect(worklogEntryParser.parse(workLogExpression)).toEqual(undefined);
    });

    it('not parse worklog with double workload days info', function () {
        var workLogExpression = '1d 1d #Project-Manhattan';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(false);
        expect(worklogEntryParser.parse(workLogExpression)).toEqual(undefined);
    });

    it('not parse worklog with double workload minutes info', function () {
        var workLogExpression = '30m 45m #Project-Manhattan';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(false);
        expect(worklogEntryParser.parse(workLogExpression)).toEqual(undefined);
    });

    it('not parse entry with invalid number', function () {
        var workLogExpression = '1h #Project-Manhattan 2h 3h @t-123456789';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(false);
        expect(worklogEntryParser.parse(workLogExpression)).toEqual(undefined);
    });

    it('not parse entry with negative workload', function () {
        var workLogExpression = '-10h #Project-Manhattan';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(false);
        expect(worklogEntryParser.parse(workLogExpression)).toEqual(undefined);
    });

    it('parse entry for date without trailing zeros', function () {
        var workLogExpression = '4h 30m #Project-Manhattan @2014/1/1';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(yesterdayDateString);
    });

    it('parse worklog padded with spaces', function () {
        var workLogExpression = '  2h #ProjectManhattan @2014/01/03   ';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression)).toEqual(
            {
                projectNames: ['ProjectManhattan'],
                workload: '2h',
                day: '2014/01/03'
            }
        );
    });

    it("parse multiple projects", function () {
        var workLogExpression = '4h #ProjectManhattan #Apollo @today';

        expect(worklogEntryParser.isValid(workLogExpression)).toBeTruthy();
        expect(worklogEntryParser.parse(workLogExpression).projectNames).toEqual([
            'ProjectManhattan', 'Apollo'
        ]);
    });

    it('parse worklog in order: workload, date, project', function () {
        var workLogExpression = new Expression()
            .withWorkload(someWorkload).withDate(someDate).withProject(someProject).build();

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).projectNames).toEqual([someProject]);
        expect(worklogEntryParser.parse(workLogExpression).workload).toEqual(someWorkload);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(someDate);
    });

    it('parse worklog in order: date, workload, project', function () {
        var workLogExpression = new Expression()
            .withDate(someDate).withWorkload(someWorkload).withProject(someProject).build();

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).projectNames).toEqual([someProject]);
        expect(worklogEntryParser.parse(workLogExpression).workload).toEqual(someWorkload);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(someDate);
    });

    it('parse worklog in order: date, project, workload', function () {
        var workLogExpression = new Expression()
            .withDate(someDate).withProject(someProject).withWorkload(someWorkload).build();

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).projectNames).toEqual([someProject]);
        expect(worklogEntryParser.parse(workLogExpression).workload).toEqual(someWorkload);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(someDate);
    });

    it('parse worklog in order: project, workload, date', function () {
        var workLogExpression = new Expression()
            .withProject(someProject).withWorkload(someWorkload).withDate(someDate).build();

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).projectNames).toEqual([someProject]);
        expect(worklogEntryParser.parse(workLogExpression).workload).toEqual(someWorkload);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(someDate);
    });

    it('parse worklog in order: project, date, workload', function () {
        var workLogExpression = new Expression()
            .withProject(someProject).withDate(someDate).withWorkload(someWorkload).build();

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).projectNames).toEqual([someProject]);
        expect(worklogEntryParser.parse(workLogExpression).workload).toEqual(someWorkload);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(someDate);
    });

    it('parse worklog in order: date, project', function () {
        var workLogExpression = new Expression().withDate(someDate).withProject(someProject).build();

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).projectNames).toEqual([someProject]);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(someDate);
    });

    it('parse worklog in order: project, workload', function () {
        var workLogExpression = new Expression().withProject(someProject).withWorkload(someWorkload).build();

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).projectNames).toEqual([someProject]);
        expect(worklogEntryParser.parse(workLogExpression).workload).toEqual(someWorkload);
    });

    function Expression() {

        var expression = "";

        this.withWorkload = function(workload) {
            addSpaceIfNeeded();
            expression += workload;
            return this;
        };

        this.withProject = function(project) {
            addSpaceIfNeeded();
            expression += "#" + project;
            return this;
        };

        this.withDate = function (date) {
            addSpaceIfNeeded();
            expression += "@" + date;
            return this;
        };

        this.build = function() {
            return expression;
        };

        function addSpaceIfNeeded() {
            if (expression.length > 0) {
                expression += " ";
            }
        }
    }
});
