angular.module('multi.selection',[])
    .factory('multiSelection', function () {
    var selectionStarted = false;
    var selected = [];
    var selectionStart, selectionEnd;

    var clearSelection = function (defaultSelection) {
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
        selectionStarted = false;
        if (selectionStart > element) {
            selectionEnd = selectionStart;
            selectionStart = element;
        } else {
            selectionEnd = element;
        }
    };
    var startSelection = function (element) {
        selected = [];
        selectionStarted = true;
        selectionStart = element;
        console.log(selectionStart);
    };

    var overSelection = function (element) {
        if (selectionStarted && !_.contains(selected, element)) {
            selected.push(element);
        }
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
        selectionEnd: getSelectionEnd
    }
})
