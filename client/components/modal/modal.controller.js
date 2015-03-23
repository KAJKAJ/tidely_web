'use strict';

angular.module('doresolApp')
  .controller('ModalCtrl', function ($scope, $modalInstance, paramFromDialogName, paramFromDialogObject) {
  
  $scope[paramFromDialogName] = paramFromDialogObject;
  // console.log($scope);
  $scope.ok = function () {
    $modalInstance.close($scope[paramFromDialogName]);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

});