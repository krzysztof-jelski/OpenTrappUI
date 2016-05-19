describe("Available Months", function () {

    var availableMonths;
    var timeProviderStub;
    var currentMonth;

    beforeEach(function() {

        module("openTrapp.report");

        module(function($provide) {
            timeProviderStub = {moment: function () {
                return moment("2014/01", "YYYY/MM");
            }};
            $provide.value('timeProvider', timeProviderStub);
        });

        inject(function(_availableMonths_,_currentMonth_) {
            availableMonths = _availableMonths_;
            currentMonth = _currentMonth_;
        });
    });

    it('offers 2 next months, current month and 2 previous months', function () {
        var months = availableMonths.get(currentMonth);

        expect(months).toEqual(['2014/03','2014/02', '2014/01', '2013/12', '2013/11']);
    });


});