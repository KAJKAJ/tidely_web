'use strict';

angular.module('doresolApp')
  .controller('LoiCtrl', function ($scope,Memorial,$stateParams,User,$state,$http,ENV,$firebase,Composite) {

  	// console.log('ProfileCtrl');
    $scope.memorialKey = $stateParams.id;
    $scope.memorial = Memorial.getCurrentMemorial();
    $scope.currentUser = User.getCurrentUser();

    $scope.users = User.getUsersObject();
    $scope.members = {};
    $scope.waitings = {};
    $scope.watingsCnt = 0;

    $scope.memorial.$loaded().then(function(value) {
      console.log('-----------');
      console.log($scope.memorial);
      $scope.leader = User.findById($scope.memorial.ref_user);
      User.setUsersObject($scope.memorial.ref_user);
    });

    // from waiting list to member list
    $scope.updateMedicalForm = function(form) {

      if(form.$valid){
        Memorial.update($scope.memorialKey,

          {
            letter_of_intent: {
              funeral: {
                grave_choice: 'aaa'
              },
              medical_care: {
                surviving_treatment: {
                  brain: true,
                  dying: false,
                  old: false
                }
              }
            }
          }

        ).then(function(){
          $scope.message = '저장되었습니다.';
        });
      }
    };

    $scope.updateFuneralForm = function(form) {

    }

  });
