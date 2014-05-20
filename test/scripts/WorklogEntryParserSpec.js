describe('WorkLogEntry Parser should', function () {
    beforeEach(module('openTrapp'));

    var timeProvider;
    var worklogEntryParser;
    var currentDateString = "2014/01/02";
    var yesterdayDateString = "2014/01/01";
    var tomorrowDateString = "2014/01/03";
    var mondayBeforeTodayString = "2013/12/30";
    var fridayBeforeTodayString = "2013/12/27";
    var mondayAfterTodayString = "2014/01/06";
    var fridayAfterTodayString = "2014/01/03";
    var someWorkload = '1d 1h 1m';
    var someProject = 'ProjectManhattan';
    var someDate = '2013/02/01';

    beforeEach(inject(function (_worklogEntryParser_, _timeProvider_) {
        timeProvider = _timeProvider_;
        worklogEntryParser = _worklogEntryParser_;
        spyOn(timeProvider, 'getCurrentDate').and.returnValue(new Date(currentDateString));
    }));

    it('parse full worklog', function () {
        workLogExpression = '2h #ProjectManhattan @2014/01/03';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression)).toEqual(
            {
                projectName: 'ProjectManhattan',
                workload: '2h',
                day: '2014/01/03'
            }
        );
    });

    it('parse worklog for today', function () {
        workLogExpression = '2h #ProjectManhattan';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(currentDateString);
    });

    it('parse worklog for monday', function () {
        workLogExpression = '2h #ProjectManhattan @monday';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(mondayBeforeTodayString);
    });

    it('parse worklog for weekday with upper letter', function () {
        workLogExpression = '2h #ProjectManhattan @Monday';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(mondayBeforeTodayString);
    });

    it('parse worklog for friday', function () {
        workLogExpression = '2h #ProjectManhattan @friday';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(fridayBeforeTodayString);
    });

    it('parse worklog for last monday', function () {
        workLogExpression = '2h #ProjectManhattan @last-monday';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(mondayBeforeTodayString);
    });

    it('parse worklog for last friday', function () {
        workLogExpression = '2h #ProjectManhattan @last-friday';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(fridayBeforeTodayString);
    });

    it('parse worklog for next monday', function () {
        workLogExpression = '2h #ProjectManhattan @next-monday';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(mondayAfterTodayString);
    });

    it('parse worklog for next friday', function () {
        workLogExpression = '2h #ProjectManhattan @next-friday';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(fridayAfterTodayString);
    });

    it('parse worklog for yesterday', function () {
        workLogExpression = '2h #ProjectManhattan @yesterday';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(yesterdayDateString);
    });

    it('parse worklog for today', function () {
        workLogExpression = '2h #ProjectManhattan @today';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(currentDateString);
    });

    it('parse worklog for tomorrow', function () {
        workLogExpression = '2h #ProjectManhattan @tomorrow';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(tomorrowDateString);
    });

    it('parse worklog for yesterday by t-1', function () {
        workLogExpression = '2h #ProjectManhattan @t-1';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(yesterdayDateString);
    });

    it('parse worklog for tomorrow by t+1', function () {
        workLogExpression = '2h #ProjectManhattan @t+1';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(tomorrowDateString);
    });

    it('parse worklog with days and hours', function () {
        workLogExpression = '1d 3h #ProjectManhattan';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).workload).toEqual("1d 3h");
    });

    it('parse worklog with days and hours', function () {
        workLogExpression = '1d 5h 15m #ProjectManhattan';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).workload).toEqual("1d 5h 15m");
    });

    it('parse worklog for 1d by default', function () {
        workLogExpression = '#ProjectManhattan';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).workload).toEqual("1d");
    });

    it('not parse worklog for invalid date', function () {
        workLogExpression = '#ProjectManhattan @invalid';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(false);
    });

    it('not parse worklog for invalid text', function () {
        workLogExpression = 'invalid';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(false);
    });

    it("not parse worklog for fractions", function () {
        workLogExpression = '1,5h #ProjectMangattan';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(false);
    });

    it('not parse empty project', function () {
        workLogExpression = '#';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(false);
    });

    it('not parse workload at the end of project name', function () {
        workLogExpression = '#project2d';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).workload).toEqual("1d");
        expect(worklogEntryParser.parse(workLogExpression).projectName).toEqual("project2d");
    });

    it('parse worklog with hyphen in project for today', function () {
        workLogExpression = '2h #Project-Manhattan';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).projectName).toEqual("Project-Manhattan");
    });

    it('not parse worklog with double day info', function () {
        workLogExpression = '#Project-Manhattan @monday @tuesday';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(false);
        expect(worklogEntryParser.parse(workLogExpression)).toEqual(undefined);
    });

    it('not parse worklog with double workload hours info', function () {
        workLogExpression = '2h 3h #Project-Manhattan';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(false);
        expect(worklogEntryParser.parse(workLogExpression)).toEqual(undefined);
    });

    it('not parse worklog with double workload days info', function () {
        workLogExpression = '1d 1d #Project-Manhattan';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(false);
        expect(worklogEntryParser.parse(workLogExpression)).toEqual(undefined);
    });

    it('not parse worklog with double workload minutes info', function () {
        workLogExpression = '30m 45m #Project-Manhattan';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(false);
        expect(worklogEntryParser.parse(workLogExpression)).toEqual(undefined);
    });

    it('not parse worklog with double project info', function () {
        workLogExpression = '#Project-Manhattan #Project-Manhattan2';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(false);
        expect(worklogEntryParser.parse(workLogExpression)).toEqual(undefined);
    });

    it('not parse entry with invalid number', function () {
        workLogExpression = '1h #Project-Manhattan 2h 3h @t-123456789';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(false);
        expect(worklogEntryParser.parse(workLogExpression)).toEqual(undefined);
    });

    it('not parse entry with negative workload', function () {
        workLogExpression = '-10h #Project-Manhattan';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(false);
        expect(worklogEntryParser.parse(workLogExpression)).toEqual(undefined);
    });

    it('parse entry for date without trailing zeros', function () {
        workLogExpression = '4h 30m #Project-Manhattan @2014/1/1';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(yesterdayDateString);
    });

    it('parse worklog padded with spaces', function () {
        workLogExpression = '  2h #ProjectManhattan @2014/01/03   ';

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression)).toEqual(
            {
                projectName: 'ProjectManhattan',
                workload: '2h',
                day: '2014/01/03'
            }
        );
    });

    it('parse worklog in order: workload, date, project', function () {
        workLogExpression = new Expression()
            .withWorkload(someWorkload).withDate(someDate).withProject(someProject).build();

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).projectName).toEqual(someProject);
        expect(worklogEntryParser.parse(workLogExpression).workload).toEqual(someWorkload);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(someDate);
    });

    it('parse worklog in order: date, workload, project', function () {
        workLogExpression = new Expression()
            .withDate(someDate).withWorkload(someWorkload).withProject(someProject).build();

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).projectName).toEqual(someProject);
        expect(worklogEntryParser.parse(workLogExpression).workload).toEqual(someWorkload);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(someDate);
    });

    it('parse worklog in order: date, project, workload', function () {
        workLogExpression = new Expression()
            .withDate(someDate).withProject(someProject).withWorkload(someWorkload).build();

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).projectName).toEqual(someProject);
        expect(worklogEntryParser.parse(workLogExpression).workload).toEqual(someWorkload);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(someDate);
    });

    it('parse worklog in order: project, workload, date', function () {
        workLogExpression = new Expression()
            .withProject(someProject).withWorkload(someWorkload).withDate(someDate).build();

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).projectName).toEqual(someProject);
        expect(worklogEntryParser.parse(workLogExpression).workload).toEqual(someWorkload);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(someDate);
    });

    it('parse worklog in order: project, date, workload', function () {
        workLogExpression = new Expression()
            .withProject(someProject).withDate(someDate).withWorkload(someWorkload).build();

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).projectName).toEqual(someProject);
        expect(worklogEntryParser.parse(workLogExpression).workload).toEqual(someWorkload);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(someDate);
    });

    it('parse worklog in order: date, project', function () {
        workLogExpression = new Expression().withDate(someDate).withProject(someProject).build();

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).projectName).toEqual(someProject);
        expect(worklogEntryParser.parse(workLogExpression).day).toEqual(someDate);
    });

    it('parse worklog in order: project, workload', function () {
        workLogExpression = new Expression().withProject(someProject).withWorkload(someWorkload).build();

        expect(worklogEntryParser.isValid(workLogExpression)).toBe(true);
        expect(worklogEntryParser.parse(workLogExpression).projectName).toEqual(someProject);
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
