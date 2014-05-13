describe("RegistrationTypeahead", function(){
	
	var scope, http, projectNames,datesSuggestions;

	beforeEach(module('openTrapp'));
    beforeEach(inject(function(_enviromentInterceptor_){
    	_enviromentInterceptor_.request = function(x){
    		return x;
    	};
    }));
	
	beforeEach(inject(function($rootScope, $controller, $httpBackend, _projectNames_, _datesSuggestions_) {
		scope = $rootScope.$new();
		$controller('RegistrationCtrl', {
			$scope : scope
		});
		http = $httpBackend;
		projectNames = _projectNames_;
        datesSuggestions = _datesSuggestions_;
	}));

	var followingProjectsAreAvailable = function(){

		var args = _.toArray(arguments);

        http.expectGET("http://localhost:8080/endpoints/v1/projects/").respond(200, args);
        projectNames.forEach(function(){});
        http.flush();
	};

    function followingDatesAreAvailable() {
        var args = _.toArray(arguments);
        spyOn(datesSuggestions,'startingWith').and.returnValue(args);
    }

	var suggestions = function (){
		return scope.suggestions;
	};

	var userTypes = function(input){
		scope.workLogExpression = input;
		scope.$digest();
	};

	var userConfirmFirstSuggestion = function(){
		scope.selectSuggestion(scope.suggestions[0]);
	};

	it("suggests all available projects after typing #", function(){

		// given:
		followingProjectsAreAvailable('ProjectManhattan', 'ApolloProgram');
		// when:
		userTypes('#');
		// then:
		expect(suggestions()).toContain('ProjectManhattan', 'AppolloProgram');
	});

	it("does not suggest any projects if # is not present", function(){

		// given:
		followingProjectsAreAvailable('ProjectManhattan', 'ApolloProgram');
		// when:
		userTypes('1d');
		// then:
		expect(suggestions()).toEqual([]);
	});

	it("does not suggest any projects if # is recently added character", function(){

		// given:
		followingProjectsAreAvailable('ProjectManhattan', 'ApolloProgram');
		// when:
		userTypes('1d #AppolloProject @Proj');
		// then:
		expect(suggestions()).not.toContain('ProjectManhattan')
	});

	it("does not suggest any projects if # is recently added character", function(){

		// given:
		followingProjectsAreAvailable('ProjectManhattan', 'ApolloProgram');
		// when:
		userTypes('1d #ApolloProject ');
		// then:
		expect(suggestions()).toEqual([]);
	});

	it("suggest project starts with pattern", function(){

		// given:
		followingProjectsAreAvailable('ProjectManhattan', 'ApolloProgram');
		// when:
        userTypes('#Ap');
		// then:
		expect(suggestions()).toEqual(['ApolloProgram']);
	});

	it("complete project name on selecting suggestions", function(){

		// given:
		followingProjectsAreAvailable('ProjectManhattan', 'ApolloProgram');
		// when:
        userTypes('1d #ApolloPro');
		userConfirmFirstSuggestion();
		// then:
		expect(scope.workLogExpression).toEqual('1d #ApolloProgram ');
	});

    it("suggest weekday names", function () {
        // given:
        followingDatesAreAvailable("monday", "tuesday");

        // when:
        userTypes("@");

        expect(scope.suggestions).toEqual(["monday", "tuesday"]);
    });

    it("suggest weekday names", function () {
        // given:
        followingDatesAreAvailable("monday");

        // when:
        userTypes("1d #project @mo");
        userConfirmFirstSuggestion()

        expect(scope.workLogExpression).toEqual('1s #project @monday');
    });

});
