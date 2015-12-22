describe('BulkEditModalCtrl', function () {

    beforeEach(module('openTrapp'));
    beforeEach(inject(function(_enviromentInterceptor_){
        _enviromentInterceptor_.request = function(x){
            return x;
        };
    }));

    var http, httpBackend, scope, modal;

    beforeEach(inject(function ($httpBackend, $http, $controller, $rootScope, $modal) {
        httpBackend = $httpBackend;
        http = $http;
        scope = $rootScope.$new();
        modal = jasmine.createSpyObj("modal", ["close", 'dismiss', 'open']);
    }));

    it("sends bulk edit request to the server", function () {
        
        modalIsAlreadyOpen("*employee #project");
        
        httpBackend.expectPOST("http://localhost:8080/endpoints/v1/work-log/bulk-update",
            { query: "*employee #project", expression: "+#paid"}).respond(200);
                
        scope.form.expression = "+#paid";
        scope.ok();
        httpBackend.flush();
    });

    it("validates query against server", function () {

        httpBackend.expectGET("http://localhost:8080/endpoints/v1/work-log/!employee=employee+!project=project")
             .respond(200, { entriesAffected: 12 });
        
        open("*employee #project");
        httpBackend.flush();
        
        expect(scope.entriesAffected).toBe(12);
    });

    it("validates query after every change against server", function () {

        modalIsAlreadyOpen("");
        
        httpBackend.expectGET("http://localhost:8080/endpoints/v1/work-log/!employee=employee+!project=project")
             .respond(200, { entriesAffected: 12 });
        
        scope.onQueryChange("*employee #project");
        httpBackend.flush();
        
        expect(scope.entriesAffected).toBe(12);
    });

    it("displays error when query is not valid", function () {

        modalIsAlreadyOpen("");
        
        httpBackend.expectGET("http://localhost:8080/endpoints/v1/work-log/invalid!")
             .respond(400, { error: "Invalid query" });
        
        scope.onQueryChange("invalid!");
        httpBackend.flush();
        
        expect(scope.alerts[0].message).toBe("Invalid query");
    });

    function open(query){
        new BulkEditModalCtrl(modal, scope, http, query);
    }
    
    function modalIsAlreadyOpen(query){
        httpBackend.expectGET(/http:\/\/localhost:8080\/endpoints\/v1\/work-log\/.*/).respond(200, { entriesAffected: 10});
        open(query);
        httpBackend.flush();
    }
    
});