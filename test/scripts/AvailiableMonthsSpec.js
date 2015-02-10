describe("Available Months", function () {

    var availableMonths;
    var timeProviderStub;
    var currentMonth;

    beforeEach(function() {

        module("openTrapp");

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

    it('offers 3 previous months, current month and 3 next months', function () {
        var months = availableMonths.get(currentMonth, 3);

        expect(months).toEqual(['2013/10', '2013/11', '2013/12', '2014/01', '2014/02', '2014/03', '2014/04']);
    });


});