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

	it('fetches data for given months', function(){
		
		// expect:
		httpBackend
			.expectGET('http://localhost:8080/endpoints/v1/calendar/201401,201402/work-log/entries')
			.respond(200);
		
		// when:
		worklog.setMonths(['2014/01,2014/02']);
		httpBackend.flush();
	});
	
	it('exposes active month', function(){
		
		// given:
		monthContainsFollowingItems(['2014/01'], []);
		
		// when:
		worklogFor(['2014/01']);
		
		// then:
		expect(worklog.monthsNames()).toContain('2014/01');
	});
	
	it('exposes project names', function(){
		
		// given:
		monthContainsFollowingItems(['2014/01'],
				[
				 { projectNames: ['ProjectManhattan'] },
				 { projectNames: ['ApolloProgram'] }
			    ]);
		// when:
		worklogFor(['2014/01']);
		
		// then:
		expect(worklog.projects['ProjectManhattan']).toBeDefined();
		expect(worklog.projects['ApolloProgram']).toBeDefined()
	});

	it('exposes employee usernames', function(){
		
		// given:
		monthContainsFollowingItems(['2014/01'],
				[
				 { employee: 'bart.simpson' }, 
				 { employee: 'homer.simpson' } 
			    ]);
		// when:
		worklogFor(['2014/01']);
		
		// then:
		expect(worklog.employees['bart.simpson']).toBeDefined();
		expect(worklog.employees['homer.simpson']).toBeDefined()
	});

	it('enables project', function(){
		
		// given:
		worklogWith({ 
			projectNames: ['ProjectManhattan']
		});
		
		// when:
		worklog.enableProject('ProjectManhattan');
		
		// then:
		expect(worklog.projects['ProjectManhattan'].active).toBeTruthy();
	});
	
	it('enables project twice', function(){
		
		// given:
		worklogWith({ 
			projectNames: ['ProjectManhattan']
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
				{ projectNames: ['ProjectManhattan'] },
				{ projectNames: ['ApolloProgram'] }
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
				{ projectNames: ['ProjectManhattan'] },
				{ projectNames: ['ApolloProgram'] }
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
				projectNames: ['ProjectManhattan']
			});
		
		// when:
		worklog.toggleProject('ProjectManhattan');
		
		// then:
		expect(worklog.projects['ProjectManhattan'].active).toBeTruthy();
	});
	
	it('toggles project twice', function(){
		
		// given:
		worklogWith({ 
				projectNames: ['ProjectManhattan']
			});

		// when:
		worklog.toggleProject('ProjectManhattan');
		worklog.toggleProject('ProjectManhattan');
		
		// then:
		expect(worklog.projects['ProjectManhattan'].active).toBeFalsy();
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
				{ employee: 'bart.simpson', projectNames: ['ProjectManhattan']},
				{ employee: 'bart.simpson', projectNames: ['ApolloProgram']},
				{ employee: 'homer.simpson', projectNames: ['OtherProject']}
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
		monthContainsFollowingItems(['2014/02'], []);

		// when:
		worklogWith(
				{ employee: 'bart.simpson', projectNames: ['ProjectManhattan'] });
		toggleAll();
		worklogFor(['2014/02']);
		
		// then:
		expect(worklog.entries).toEqual([]);
	});
	
	it('maintains active employees after changing month', function(){
		
		// given:
		worklog.toggleEmployee('bart.simpson');
		
		// when:
		worklogWith({ employee: 'bart.simpson', projectNames: ['ProjectManhattan'] });
		
		// then:
		expect(worklog.employees['bart.simpson'].active).toBeTruthy();
	});

	it('maintains active projects after changing month', function(){
		
		// given:
		worklog.toggleProject('ProjectManhattan');
		
		// when:
		worklogWith({ employee: 'bart.simpson', projectNames: ['ProjectManhattan'] });
		
		// then:
		expect(worklog.projects['ProjectManhattan'].active).toBeTruthy();
	});
	
	it('list all eligible workload entries', function(){
		
		// given:
		worklogWith(
				{ employee: 'bart.simpson', projectNames: ['ProjectManhattan'] },
				{ employee: 'homer.simpson', projectNames: ['ProjectManhattan'] },
				{ employee: 'bart.simpson', projectNames: ['ApolloProgram'] },
				{ employee: 'homer.simpson', projectNames: ['ApolloProgram'] }
			);
		
		// when:
		worklog.toggleEmployee('bart.simpson');
		worklog.toggleProject('ApolloProgram');
		
		// then:
		expect(worklog.entries).toEqual([{ employee: 'bart.simpson', projectNames: ['ApolloProgram'] }]);
	});
	
	describe('totals', function(){
		
		beforeEach(function(){

			// given:
			worklogWith(
					{ employee: 'bart.simpson', projectNames: ['ProjectManhattan'], workload: '1m', day: "2014/01/10" },
					{ employee: 'homer.simpson', projectNames: ['ProjectManhattan'], workload: '1h', day: "2014/01/10" },
					{ employee: 'bart.simpson', projectNames: ['ApolloProgram'], workload: '1d', day: "2014/01/10" },
					{ employee: 'homer.simpson', projectNames: ['ApolloProgram'], workload: '7m', day: "2014/01/10" },
					{ employee: 'inactive.employee', projectNames: ['ProjectManhattan'], workload: '1h 15m', day: "2014/01/10"},
					{ employee: 'homer.simpson', projectNames: ['InactiveProject'], workload: '1h 45m', day: "2014/01/10"}
			);
			
			// when:
			worklog.toggleEmployee('bart.simpson');
			worklog.toggleEmployee('homer.simpson');
			worklog.toggleProject('ProjectManhattan');
			worklog.toggleProject('ApolloProgram');
			
		});
		
		it('is calculated for active month', function(){
			
			// then:
			expect(worklog.months[0].total).toEqual("1d 1h 8m");
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

		it('is calculated for inactive project', function(){
			
			// then:
			expect(worklog.projects['InactiveProject'].total).toEqual("1h 45m");
		});

	});


    describe("handlig worklog for multiple months", function () {

        it('total is calculated for each moth', function(){
            monthContainsFollowingItems(['2014/01','2014/02'], [
                { day: "2014/01/10", employee: 'homer.simpson', projectNames: ['ApolloProgram'], workload: '1h'},
                { day: "2014/02/10", employee: 'homer.simpson', projectNames: ['ApolloProgram'], workload: '2h'}
            ]);
            worklogFor(['2014/01','2014/02']);

            worklog.toggleEmployee('homer.simpson');
            worklog.toggleProject('ApolloProgram');

            expect(worklog.month('2014/01').total).toEqual("1h");
            expect(worklog.month('2014/02').total).toEqual("2h");
        });

        it('knows if contains data for moth', function(){
            monthContainsFollowingItems(['2014/01','2014/02','2014/03'], [
                { employee: 'homer.simpson', projectNames: ['ApolloProgram'], workload: '2h'}
            ]);

            worklogFor(['2014/01','2014/02','2014/03']);

            expect(worklog.isForMonth('2014/01')).toBeTruthy();
            expect(worklog.isForMonth('2014/02')).toBeTruthy();
            expect(worklog.isForMonth('2014/03')).toBeTruthy();
            expect(worklog.isForMonth('2014/04')).toBeFalsy();
        });

    });


    describe("totals for multiple projects", function () {

        it('is calculated for multiple projects', function(){
            worklogWith(
                { employee: 'homer.simpson', projectNames: ['MultiProject1', 'MultiProject2'], workload: '1h 25m'}
            );

            worklog.toggleEmployee('homer.simpson');

            expect(worklog.projects['MultiProject1'].total).toEqual("1h 25m");
            expect(worklog.projects['MultiProject2'].total).toEqual("1h 25m");
            expect(worklog.employees['homer.simpson'].total).toEqual("0h");
        });

        it('is calculated for employee with one project selected', function(){
            worklogWith(
                { employee: 'homer.simpson', projectNames: ['MultiProject1', 'MultiProject2'], workload: '1h 25m'}
            );

            worklog.toggleProject('MultiProject1');

            expect(worklog.projects['MultiProject1'].total).toEqual("0h");
            expect(worklog.projects['MultiProject2'].total).toEqual("0h");
            expect(worklog.employees['homer.simpson'].total).toEqual("1h 25m");
        });

        it('is calculated for employee when multiple projects selected', function(){
            worklogWith(
                { employee: 'homer.simpson', projectNames: ['MultiProject1', 'MultiProject2'], workload: '1h 25m'}
            );

            worklog.toggleProject('MultiProject1');
            worklog.toggleProject('MultiProject2');

            expect(worklog.employees['homer.simpson'].total).toEqual('1h 25m');
        });
    });
	
	describe('notifications', function(){
		
		it('executes callback when worklog is ready', function(){
			
			// given:
			var callback = jasmine.createSpy('callback');
			monthContainsFollowingItems(['2014/01'], []);
	
			// when:
			worklog.setMonths(['2014/01'], callback);
			expect(callback).not.toHaveBeenCalled();
			httpBackend.flush();
			
			// then:
			expect(callback).toHaveBeenCalled();
		});

		it('executes callback when worklog is changed (month)', function(){
			
			// given:
			var callback = jasmine.createSpy('callback');
			worklogWith({
				projectNames: ["ProjectManhattan"]
			});
			
			// when:
			worklog.onUpdate(callback);
			expect(callback).not.toHaveBeenCalled();
			worklog.setMonths(['2014/01']);
			httpBackend.flush();
			
			// then:
			expect(callback).toHaveBeenCalled();
		});

		it('executes callback when worklog is changed (employee)', function(){
			
			// given:
			var callback = jasmine.createSpy('callback');
			worklogWith({
					projectNames: ["ProjectManhattan"]
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
			.whenGET('http://localhost:8080/endpoints/v1/calendar/' + month.join(',').replace(new RegExp('/', 'g'), '') + '/work-log/entries')
			.respond(200, { items: items });
	};
	
	var worklogFor = function(month){
		worklog.setMonths(month);
		httpBackend.flush();
	};
	
	var worklogWith = function(items){

		monthContainsFollowingItems(['2014/01'], _.toArray(arguments));
		worklogFor(['2014/01']);
	};

});