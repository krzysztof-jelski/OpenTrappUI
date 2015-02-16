describe('Worklogs', function () {

    var httpBackend, worklogsProvider;
    var worklogs;

    beforeEach(module('openTrapp'));

    beforeEach(inject(function ($httpBackend, _worklogsProvider_) {
        httpBackend = $httpBackend;
        worklogsProvider = _worklogsProvider_;
        worklogs = worklogsProvider;
        console.log(_worklogsProvider_);
    }));

    xit("calculates total for months", function () {
        worklogWith(
            {employee: 'bart.simpson', projectNames: ['ProjectManhattan'], workload: '1d'},
            {employee: 'bart.simpson', projectNames: ['ApolloProgram'], workload: '1d'}
        );

        worklogs.toggleEmployee('bart.simpson');
        worklogs.toggleProject('ProjectManhattan');

        var total = worklogs.total(["2014/01"]);

        expect(total).toEqual(10);
    });

    it("gets all Projects", function () {
        worklogWith({
                projectNames: ['ProjectManhattan']
            },
            {
                projectNames: ['Other']
            });

        var projects = worklogs.projects();

        expect(projects).toEqual(
            {
                ProjectManhattan: {active: false, total: '0h'},
                Other: {active: false, total: '0h'}
            });

    });
    it("represents month", function () {
        worklogWith({
            projectNames: ['ProjectManhattan']
        });

        var forMoth = worklogs.areForMonth('2014/01');

        expect(forMoth).toBeTruthy()

    });

    it('exposes employee usernames', function(){

        // given:
        monthContainsFollowingItems('2014/01',
            [
                { employee: 'bart.simpson' },
                { employee: 'homer.simpson' }
            ]);
        // when:
        worklogFor('2014/01');

        // then:
        expect(worklogs.employees()['bart.simpson']).toBeDefined();
        expect(worklogs.employees()['homer.simpson']).toBeDefined()
    });

    it('enables project', function(){

        // given:
        worklogWith({
            projectNames: ['ProjectManhattan']
        });

        // when:
        worklogFor('2014/01');

        // then:
        expect(worklogs.projects()['ProjectManhattan']).toBeDefined();
        expect(worklogs.projects()['ApolloProgram']).toBeUndefined()
    });

    it('enable employee projects', function(){

        // given:
        worklogWith(
            { employee: 'bart.simpson', projectNames: ['ProjectManhattan']},
            { employee: 'bart.simpson', projectNames: ['ApolloProgram']},
            { employee: 'homer.simpson', projectNames: ['OtherProject']}
        );

        // when:
        worklogs.enableEmployeeProjects('bart.simpson');

        // then:
        expect(worklogs.projects()['ProjectManhattan'].active).toBeTruthy();
        expect(worklogs.projects()['ApolloProgram'].active).toBeTruthy();
        expect(worklogs.projects()['OtherProject'].active).toBeFalsy();
    });


    var worklogWith = function (items) {

        monthContainsFollowingItems('2014/01', _.toArray(arguments));
        worklogFor('2014/01');
    };

    var monthContainsFollowingItems = function (month, items) {
        httpBackend
            .whenGET('http://open-trapp.herokuapp.com/endpoints/v1/calendar/' + month + '/work-log/entries')
            .respond(200, {items: items});
    };

    var worklogFor = function (month) {
        worklogs.setMonths([month]);
        httpBackend.flush();
    };

});