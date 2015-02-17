angular.module('multi.selection',[])
    .factory('multiSelection', function () {
    var selectionStarted = false;
    var selected = [];
    var selectionStart, selectionEnd;

    var clearSelection = function (defaultSelection) {
        console.log('clear selection');
        if (selectionStarted) {
            selected = [];
            selectionStarted = false;
            selectionStart = defaultSelection;
            selectionEnd = defaultSelection;
        }
    };

    var isSelected = function (element) {
        return _.contains(selected, element)
    };

    var endSelection = function (element) {
        console.log('end selection');
        selectionStarted = false;
        if (selectionStart > element) {
            selectionEnd = selectionStart;
            selectionStart = element;
        } else {
            selectionEnd = element;
        }
    };
    var startSelection = function (element) {
        console.log('start Selection');
        selected = [];
        selectionStarted = true;
        selectionStart = element;
    };

    var overSelection = function (element) {
        console.log('over Selection');
        if (selectionStarted && !_.contains(selected, element)) {
            selected.push(element);
        }
    };

    var getSelected = function(){
        return selected;
    };

    var getSelectionStart = function(){
        return selectionStart
    };

    var getSelectionEnd = function(){
        return selectionEnd
    };

    return{
        clearSelection: clearSelection,
        isSelected: isSelected,
        endSelection: endSelection,
        startSelection: startSelection,
        overSelection: overSelection,
        selectionStart: getSelectionStart,
        selectionEnd: getSelectionEnd,
        selected: getSelected
    }
});
