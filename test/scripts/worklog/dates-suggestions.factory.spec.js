describe("DatesSuggestions", function () {

    var timeProvider, dateSuggestions;

    beforeEach(module("openTrapp.worklog"));

    beforeEach(function () {
        installPromiseMatchers();
    });

    beforeEach(inject(function (_timeProvider_, _datesSuggestions_) {
        timeProvider = _timeProvider_;
        dateSuggestions = _datesSuggestions_;
    }));

    it("suggests by day name", function () {
        spyOn(timeProvider, 'getCurrentDate').and.returnValue(new Date('2014/05/12'));

        expect(dateSuggestions.loadAllStartingWith("tu")).toBeResolvedWith([
            {value: 'tuesday', description: '2014/05/06'}
        ]);
    });

    it("suggests by date", function () {
        spyOn(timeProvider, 'getCurrentDate').and.returnValue(new Date('2014/05/05'));

        expect(dateSuggestions.loadAllStartingWith("2014/05/01")).toBeResolvedWith([
            {value: 'thursday', description: '2014/05/01'}
        ]);
    });

});
