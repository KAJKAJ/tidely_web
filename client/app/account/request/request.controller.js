'use strict';

angular.module('doresolApp')
  .controller('RequestCtrl', function RequestCtrl($scope, Util, $stateParams, Memorial, Composite, User,$state) {

    $scope.memorial = Memorial.findById($stateParams.memorialId);
    $scope.currentUser = User.getCurrentUser();
    $scope.users = User.getUsersObject();

    console.log($scope.memorial);
    console.log($state.params);

    $scope.memorial.$loaded().then(function() {
        User.setUsersObject($scope.memorial.ref_user);
    })
    
    $scope.cancel = function() {
        var params = {
            memorialId: $state.params.memorialId,
            requesterId: $state.params.requesterId
        };
        Composite.removeWaiting(params).then(function(value){
            $state.go('memorials');
        })
    }

    $scope.accept = function() {
        console.log($state.params);
        var params = {
            memorialId: $state.params.memorialId,
            requesterId: $state.params.requesterId
        };
        Composite.addWaiting(params).then(function(value){
            $state.go('memorials');
        })
    }

    // $scope.openModal = function (story) {
    //   var modalInstance = $modal.open({
    //     templateUrl: 'app/memorial/story/edit_modal.html',
    //     controller: 'ModalCtrl',
    //     size: 'lg',
    //     resolve: { 
    //       paramFromDialogName: function(){
    //         return 'story';
    //       },         
    //       paramFromDialogObject: function () {
    //         console.log(story);
    //         return story;
    //       }
    //     }
    //   });

    //   modalInstance.result.then(function (paramFromDialogObject) {
    //     //click ok
    //     // console.log('click ok');
    //     // $scope.paramFromDialogObject = paramFromDialogObject;
    //     console.log($scope);
    //   }, function () {
    //     //canceled
    //   });
    // };

  });