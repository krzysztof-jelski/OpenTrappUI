angular.module('openTrapp')
    .controller('EditCtrl', function ($scope, $modal, projectNames, $http, worklog) {

        $scope.open = function (item) {

            var modalInstance = $modal.open({
                templateUrl: 'edit.html',
                controller: EditModalCtrl,
                resolve: {
                    item: function () {
                        return item;
                    },
                    projectNames: function () {
                        return projectNames;
                    },
                    http: function () {
                        return $http;
                    },
		    worklog: function() {
			return worklog;
		    }
                }
            });

            modalInstance.result.then(function (result) {
                // FIXME - publish alert to some global alert displayer
                $scope.alerts = $scope.alerts || [];
                $scope.alerts.push(result)
            })

        };
    });

var EditModalCtrl = function ($scope, $modalInstance, item, projectNames, http, worklog) {

    var suggestions = [];
    (function gatherSuggestions() {
        suggestions = [];
        projectNames.forEach(function (name) {
            suggestions.push(name);
        })
    })();
    $scope.item = angular.copy(item);

    function getSuggestions(prefix) {
        return _.filter(suggestions, function (suggestion) {
            return suggestion.indexOf(prefix) != -1;
        });
    }

    $scope.$watch('item.projectName', function (newValue) {
        $scope.suggestions = getSuggestions(newValue);
    });

    $scope.isInvalidWorkload = function (workload){
        return !Workload.isValid(workload);
    };

    $scope.ok = function () {
        var data = {
            workload: $scope.item.workload,
            projectName: $scope.item.projectName
        };
        http.post('http://localhost:8080/endpoints/v1/work-log/entries/' + item.id, data)
            .success(function () {
                $modalInstance.close({
                    type: 'success',
                    message: 'Worklog updated'
                });
		worklog.refresh();
            })
	    .error(function(){
		console.log('error');
		$scope.shake();
	    });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

angular.module('openTrapp')
  .directive('shakeMe', ['$animate', function($animate) {

  return {
    link: function(scope, element, attrs, form) {
     
      scope.$parent.shake = function(){
		
          var e = element.parent('.modal-content');
          $animate.addClass(e, 'shake', function() {
            $animate.removeClass(e, 'shake');
          });
      };
    }
  };

}]);
