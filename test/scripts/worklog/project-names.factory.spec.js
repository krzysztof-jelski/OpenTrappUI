describe('Project Names', function () {

    var $httpBackend, $rootScope, projectNames;

    beforeEach(module('openTrapp.worklog'));

    beforeEach(function () {
        installPromiseMatchers();
    });

    beforeEach(inject(function (_$httpBackend_, _$rootScope_, _projectNames_) {
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        projectNames = _projectNames_;
    }));

    it('fetches projects from server', inject(function (projectNames) {
        // given:
        $httpBackend
            .expectGET("http://localhost:8080/endpoints/v1/projects/")
            .respond(
                200,
                ['ManhattanProject', 'ApolloProgram']
            );

        // when:
        var projectNamesPromise = projectNames.loadAllStartingWith('');
        $httpBackend.flush();

        // then:
        expect(projectNamesPromise).toBeResolvedWith(['ManhattanProject', 'ApolloProgram']);
    }));

    it('uses cache to prevent fetching projects from server on every keystroke', function () {
        // given:
        $httpBackend
            .whenGET("http://localhost:8080/endpoints/v1/projects/")
            .respond(
                200,
                ['ManhattanProject', 'ApolloProgram']
            );

        // when:
        projectNames.loadAllStartingWith('');
        $httpBackend.flush();
        $rootScope.$digest();
        projectNames.loadAllStartingWith('M');
        projectNames.loadAllStartingWith('Ma');

        // then
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('filtering', function () {

        it('filters names by matching prefix', function () {
            // given:
            $httpBackend
                .expectGET("http://localhost:8080/endpoints/v1/projects/")
                .respond(
                    200,
                    ['ManhattanProject', 'ApolloProgram']
                );

            // when:
            var projectNamesPromise = projectNames.loadAllStartingWith('Man');
            $httpBackend.flush();

            // then:
            expect(projectNamesPromise).toBeResolvedWith(['ManhattanProject']);
        });

        it('filters names by non-matching prefix', function () {
            // given:
            $httpBackend
                .expectGET("http://localhost:8080/endpoints/v1/projects/")
                .respond(
                    200,
                    ['ManhattanProject', 'ApolloProgram']
                );

            // when:
            var projectNamesPromise = projectNames.loadAllStartingWith('anh');
            $httpBackend.flush();

            // then:
            expect(projectNamesPromise).toBeResolvedWith([]);
        });

    });

});
