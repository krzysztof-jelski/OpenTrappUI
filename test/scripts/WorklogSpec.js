describe('Worklog', function() {
	
	beforeEach(module('openTrapp'));
    beforeEach(inject(function(_enviromentInterceptor_){
    	_enviromentInterceptor_.request = function(x){
    		return x;
    	};
    }));

	var httpBackend, worklog;
	
	beforeEach(inject(function($httpBackend, _worklog_) {
		httpBackend = $httpBackend;
		worklog = _worklog_;
	}));

	it('fetches data for given month', function(){
		
		// expect:
		httpBackend
			.expectGET('http://localhost:8080/endpoints/v1/calendar/2014/01/work-log/entries')
			.respond(200);
		
		// when:
		worklog.setMonth('2014/01');
		httpBackend.flush();
	});

    it('fetches data for given months', function(){

        // expect:
        httpBackend
            .expectGET('http://localhost:8080/endpoints/v1/calendar/201401/work-log/entries')
            .respond(200);
        httpBackend
            .expectGET('http://localhost:8080/endpoints/v1/calendar/201401,201402/work-log/entries')
            .respond(200);

        // when:
        worklog.toggleMonth('2014/01');
        worklog.toggleMonth('2014/02');
        httpBackend.flush();
    });

    it('exposes active month', function(){
		
		// given:
		monthContainsFollowingItems('2014/01', []); 
		
		// when:
		worklogFor('2014/01');
		
		// then:
		expect(worklog.month).toEqual('2014/01');
	});

    it('exposes project names', function(){

        // given:
        monthContainsFollowingItems('2014/01',
            [
                { projectName: 'ProjectManhattan' },
                { projectName: 'ApolloProgram' }
            ]);
        // when:
        worklogFor('2014/01');

        // then:
        expect(worklog.projects['ProjectManhattan']).toBeDefined();
        expect(worklog.projects['ApolloProgram']).toBeDefined()
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
		expect(worklog.employees['bart.simpson']).toBeDefined();
		expect(worklog.employees['homer.simpson']).toBeDefined()
	});

	it('enables project', function(){
		
		// given:
		worklogWith({ 
			projectName: 'ProjectManhattan' 
		});
		
		// when:
		worklog.enableProject('ProjectManhattan');
		
		// then:
		expect(worklog.projects['ProjectManhattan'].active).toBeTruthy();
	});
	
	it('enables project twice', function(){
		
		// given:
		worklogWith({ 
			projectName: 'ProjectManhattan' 
		});
		
		// when:
		worklog.enableProject('ProjectManhattan');
		worklog.enableProject('ProjectManhattan');
		
		// then:
		expect(worklog.projects['ProjectManhattan'].active).toBeTruthy();
	});
	
	it('enables all projects', function(){
		
		// given:
		worklogWith(
				{ projectName: 'ProjectManhattan' },
				{ projectName: 'ApolloProgram' }
			);
		
		// when:
		worklog.enableAllProjects();
		
		// then:
		expect(worklog.projects['ProjectManhattan'].active).toBeTruthy();
		expect(worklog.projects['ApolloProgram'].active).toBeTruthy();
	});
	
	it('disables all projects', function(){
		
		// given:
		worklogWith(
				{ projectName: 'ProjectManhattan' },
				{ projectName: 'ApolloProgram' }
			);
		worklog.enableAllProjects();
		
		// when:
		worklog.disableAllProjects();
		
		// then:
		expect(worklog.projects['ProjectManhattan'].active).toBeFalsy();
		expect(worklog.projects['ApolloProgram'].active).toBeFalsy();
	});
	
	it('enables employee', function(){
		
		// given:
		worklogWith({ 
				employee: 'bart.simpson' 
			});
		
		// when:
		worklog.enableEmployee('bart.simpson');
		
		// then:
		expect(worklog.employees['bart.simpson'].active).toBeTruthy();
	});

	it('enables employee twice', function(){
		
		// given:
		worklogWith({ 
			employee: 'bart.simpson' 
		});
		
		// when:
		worklog.enableEmployee('bart.simpson');
		worklog.enableEmployee('bart.simpson');
		
		// then:
		expect(worklog.employees['bart.simpson'].active).toBeTruthy();
	});
	
	it('enables all employees', function(){
		
		// given:
		worklogWith(
				{ employee: 'bart.simpson' },
				{ employee: 'homer.simpson' }
			);
		
		// when:
		worklog.enableAllEmployees();
		
		// then:
		expect(worklog.employees['bart.simpson'].active).toBeTruthy();
		expect(worklog.employees['homer.simpson'].active).toBeTruthy();
	});
	
	it('disables all employees', function(){
		
		// given:
		worklogWith(
				{ employee: 'bart.simpson' },
				{ employee: 'homer.simpson' }
		);
		worklog.enableAllEmployees();
		
		// when:
		worklog.disableAllEmployees();
		
		// then:
		expect(worklog.employees['bart.simpson'].active).toBeFalsy();
		expect(worklog.employees['homer.simpson'].active).toBeFalsy();
	});

    it('toggles project', function(){

        // given:
        worklogWith({
            projectName: 'ProjectManhattan'
        });

        // when:
        worklog.toggleProject('ProjectManhattan');

        // then:
        expect(worklog.projects['ProjectManhattan'].active).toBeTruthy();
    });

    it('toggles project twice', function(){

        // given:
        worklogWith({
            projectName: 'ProjectManhattan'
        });

        // when:
        worklog.toggleProject('ProjectManhattan');
        worklog.toggleProject('ProjectManhattan');

        // then:
        expect(worklog.projects['ProjectManhattan'].active).toBeFalsy();
    });

    it('toggles month', function(){

        // given:
        worklogWithMonths('2014/01');

        // when:
        worklog.toggleMonth('2014/01');

        // then:
        expect(worklog.months['2014/01'].active).toBeFalsy();
    });

    it('toggles month twice', function(){

        // given:
        worklogWithMonths('2014/01');

        // when:
        worklog.toggleMonth('2014/01');
        worklog.toggleMonth('2014/01');

        // then:
        expect(worklog.months['2014/01'].active).toBeTruthy();
    });


    it('toggles employee', function(){
		
		// given:
		worklogWith({ 
				employee: 'bart.simpson' 
			});
		
		// when:
		worklog.toggleEmployee('bart.simpson');
		
		// then:
		expect(worklog.employees['bart.simpson'].active).toBeTruthy();
	});

	it('toggles employee twice', function(){
		
		// given:
		worklogWith({ 
				employee: 'bart.simpson' 
			});
		
		// when:
		worklog.toggleEmployee('bart.simpson');
		worklog.toggleEmployee('bart.simpson');
		
		// then:
		expect(worklog.employees['bart.simpson'].active).toBeFalsy();
	});
	
	it('enable employee projects', function(){
		
		// given:
		worklogWith(
				{ employee: 'bart.simpson', projectName: 'ProjectManhattan'},
				{ employee: 'bart.simpson', projectName: 'ApolloProgram'},
				{ employee: 'homer.simpson', projectName: 'OtherProject'}
			);
		
		// when:
		worklog.enableEmployeeProjects('bart.simpson');
		
		// then:
		expect(worklog.projects['ProjectManhattan'].active).toBeTruthy();
		expect(worklog.projects['ApolloProgram'].active).toBeTruthy();
		expect(worklog.projects['OtherProject'].active).toBeFalsy();
	});
	
	it('list empty workload after changing month', function(){
		
		// given:
		monthContainsFollowingItems('2014/02', []); 

		// when:
		worklogWith(
				{ employee: 'bart.simpson', projectName: 'ProjectManhattan' });
		toggleAll();
		worklogFor('2014/02');
		
		// then:
		expect(worklog.entries).toEqual([]);
	});
	
	it('maintains active employees after changing month', function(){
		
		// given:
		worklog.toggleEmployee('bart.simpson');
		
		// when:
		worklogWith({ employee: 'bart.simpson', projectName: 'ProjectManhattan' });
		
		// then:
		expect(worklog.employees['bart.simpson'].active).toBeTruthy();
	});

	it('maintains active projects after changing month', function(){
		
		// given:
		worklog.toggleProject('ProjectManhattan');
		
		// when:
		worklogWith({ employee: 'bart.simpson', projectName: 'ProjectManhattan' });
		
		// then:
		expect(worklog.projects['ProjectManhattan'].active).toBeTruthy();
	});
	
	it('list all eligible workload entries', function(){
		
		// given:
		worklogWith(
				{ employee: 'bart.simpson', projectName: 'ProjectManhattan' },
				{ employee: 'homer.simpson', projectName: 'ProjectManhattan' },
				{ employee: 'bart.simpson', projectName: 'ApolloProgram' },
				{ employee: 'homer.simpson', projectName: 'ApolloProgram' }
			);
		
		// when:
		worklog.toggleEmployee('bart.simpson');
		worklog.toggleProject('ApolloProgram');
		
		// then:
		expect(worklog.entries).toEqual([{ employee: 'bart.simpson', projectName: 'ApolloProgram' }]);
	});
	
	describe('totals', function(){
		
		beforeEach(function(){

			// given:
			worklogWith(
					{ employee: 'bart.simpson', projectName: 'ProjectManhattan', workload: '1m', day: '2014/04/01' },
					{ employee: 'homer.simpson', projectName: 'ProjectManhattan', workload: '1h', day: '2014/04/02' },
					{ employee: 'bart.simpson', projectName: 'ApolloProgram', workload: '1d', day: '2014/04/03' },
					{ employee: 'homer.simpson', projectName: 'ApolloProgram', workload: '7m', day: '2014/05/04' },
					{ employee: 'inactive.employee', projectName: 'ProjectManhattan', workload: '1h 15m', day: '2014/05/05'},
					{ employee: 'homer.simpson', projectName: 'InactiveProject', workload: '1h 45m', day: '2014/05/06'},
                    { employee: 'homer.simpson', projectName: 'ApolloProgram', workload: '1d', day: '2014/06/07' }
			);
			
			// when:
            worklog.toggleMonth('2014/04');
            worklog.toggleMonth('2014/05');
			worklog.toggleEmployee('bart.simpson');
			worklog.toggleEmployee('homer.simpson');
			worklog.toggleProject('ProjectManhattan');
			worklog.toggleProject('ApolloProgram');

		});
		
		it('is calculated for active months', function(){
			
			// then:
			expect(worklog.months['2014/04'].total).toEqual("1d 1h 1m");
			expect(worklog.months['2014/05'].total).toEqual("7m");
		});

		it('is calculated for every active employee', function(){
			
			// then:
			expect(worklog.employees['bart.simpson'].total).toEqual("1d 1m");
			expect(worklog.employees['homer.simpson'].total).toEqual("1h 7m");
		});
		
		it('is calculated for every inactive employee (as if he would be active)', function(){
			
			// then:
			expect(worklog.employees['inactive.employee'].total).toEqual("1h 15m");
		});
		
		it('is calculated for every active project', function(){
			
			// then:
			expect(worklog.projects['ProjectManhattan'].total).toEqual("1h 1m");
			expect(worklog.projects['ApolloProgram'].total).toEqual("1d 7m");
		});

		it('is calculated for every active project', function(){
			
			// then:
			expect(worklog.projects['InactiveProject'].total).toEqual("1h 45m");
		});
	
	});
	
	describe('notifications', function(){
		
		it('executes callback when worklog is ready', function(){
			
			// given:
			var callback = jasmine.createSpy('callback');
			monthContainsFollowingItems('2014/01', []); 
	
			// when:
			worklog.setMonth('2014/01', callback);
			expect(callback).not.toHaveBeenCalled();
			httpBackend.flush();
			
			// then:
			expect(callback).toHaveBeenCalled();
		});

		it('executes callback when worklog is changed (month)', function(){
			
			// given:
			var callback = jasmine.createSpy('callback');
			worklogWith({
				projectName: "ProjectManhattan"
			});
			
			// when:
			worklog.onUpdate(callback);
			expect(callback).not.toHaveBeenCalled();
			worklog.setMonth('2014/01');
			httpBackend.flush();
			
			// then:
			expect(callback).toHaveBeenCalled();
		});

		it('executes callback when worklog is changed (employee)', function(){
			
			// given:
			var callback = jasmine.createSpy('callback');
			worklogWith({
					projectName: "ProjectManhattan"
				});
			
			// when:
			worklog.onUpdate(callback);
			expect(callback).not.toHaveBeenCalled();
			worklog.enableProject("ProjectManhattan");
			
			// then:
			expect(callback).toHaveBeenCalled();
		});
	});
	
	describe('deleting', function(){
		
		it('deleting', function(){
			
			// given:
			worklogWith();
			httpBackend
				.expectDELETE('http://localhost:8080/endpoints/v1/work-log/entries/WL.001')
				.respond(204);
			// when:
			worklog.remove('WL.001');
			// then:
			httpBackend.flush();
		});
		
	});
	
	// --
	
	var toggleAll = function(){
		
		_(worklog.employees).forEach(function(_, x){
			worklog.toggleEmployee(x);
		});
		_(worklog.projects).forEach(function(_, x){
			worklog.toggleProject(x);
		});
	};

    var monthContainsFollowingItems = function(month, items){
        httpBackend
            .whenGET('http://localhost:8080/endpoints/v1/calendar/' + month + '/work-log/entries')
            .respond(200, { items: items });
    };

    var monthsContainsFollowingItems = function(months, items){
        var requestMonths = _(months).map(function(x){
            return x.replace('/', '');
        }).join(",");

        httpBackend
            .whenGET('http://localhost:8080/endpoints/v1/calendar/' + requestMonths + '/work-log/entries')
            .respond(200, { items: items });
    };


    var worklogFor = function(month){
		worklog.setMonth(month);
		httpBackend.flush();
	};

    var worklogWith = function(items){

        monthContainsFollowingItems('2014/01', _.toArray(arguments));
        worklogFor('2014/01');
    };
    var worklogWithMonths = function(month){

        monthContainsFollowingItems(month, { projectName: "Default project"});
        worklogFor(month);
    };

});