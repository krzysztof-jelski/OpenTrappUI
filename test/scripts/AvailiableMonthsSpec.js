describe("Available Months", function () {

    var availableMonths;
    var timeProviderStub;
    beforeEach(function() {

        module("openTrapp");

        module(function($provide) {
            timeProviderStub = {moment: function () {
                return moment("2014/01", "YYYY/MM");
            }};
            $provide.value('timeProvider', timeProviderStub);
        });

        inject(function(_availableMonths_) {
            availableMonths = _availableMonths_;
        });
    });

    it('offers 2 next months, current month and 11 previous months', function () {
        var months = availableMonths.get();

        expect(months).toEqual(['2014/03','2014/02', '2014/01', '2013/12', '2013/11', '2013/10', '2013/09', '2013/08', '2013/07', '2013/06',
            '2013/05', '2013/04', '2013/03']);
    });



});