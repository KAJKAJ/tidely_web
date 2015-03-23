'use strict';

angular.module('doresolApp')
  .controller('InvitesCtrl', function ($scope, $window, Auth, Util, $stateParams, Composite, Memorial, User,$state) {

    console.log($stateParams);
    $scope.memorial = Memorial.findById($stateParams.memorialId);

    $scope.memorial.$loaded().then(function (value) {
    });
    
    $scope.inviterId = $stateParams.inviterId;

    $scope.users = User.getUsersObject();
    User.setUsersObject($scope.inviterId);

    $scope.cancel = function() {
      if(!User.getCurrentUser()) {
        $stae.go('main');
      } else {
        $window.history.back();
      }
    }

    $scope.accept = function() {
      var currentUser = User.getCurrentUser();
      if(currentUser) {
        $state.params.inviteeId = currentUser.uid;
        Composite.addMember($state.params).then(function(){
          $state.go("memorials");
        });
      } else {
        $state.go('main_invites', {memorialId: $stateParams.memorialId, inviterId: $stateParams.inviterId});
      }
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