describe("DatesSuggestions", function () {
    var timeProvider, dateSuggestions;

    beforeEach(module("openTrapp"));

    beforeEach(inject(function (_datesSuggestions_, _timeProvider_) {
        timeProvider = _timeProvider_;
        dateSuggestions = _datesSuggestions_;
    }));


    it("suggests by day name", function () {
        spyOn(timeProvider, 'getCurrentDate').and.returnValue(new Date('2014/05/12'));

        expect(extract(dateSuggestions.startingWith("tu"))).toEqual([
            {value: 'tuesday', description: '(2014/05/06)'}
        ]);
    });

    it("suggests by date", function () {
        spyOn(timeProvider, 'getCurrentDate').and.returnValue(new Date('2014/05/05'));

        var suggestions = extract(dateSuggestions.startingWith("2014/05/01"));

        expect(suggestions).toEqual([
            {value: 'thursday', description: '(2014/05/01)'}
        ]);
    });

    function extract(iterator) {
        var result = [];
        iterator.forEach(function (element) {
            result.push(element);
        });
        return result;
    }


});
