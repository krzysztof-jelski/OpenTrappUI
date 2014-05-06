angular.module('openTrapp')
	.controller('EditCtrl', function ($scope, $modal) {

  $scope.open = function () {

    var modalInstance = $modal.open({
      templateUrl: 'edit.html',
      controller: EditModalCtrl,
      resolve: {}
    });

  };
});

var EditModalCtrl = function ($scope, $modalInstance) {

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};