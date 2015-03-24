'use strict';

angular.module('doresolApp')
  .controller('LoiCtrl', function ($scope,Memorial,$stateParams,User,$state,$http,ENV,$firebase,Composite,toaster) {

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
      console.log($scope.memorial.letter_of_intent.medical_care);
      $scope.leader = User.findById($scope.memorial.ref_user);
      User.setUsersObject($scope.memorial.ref_user);
    });

    // from waiting list to member list
    $scope.updateMedicalForm = function(form) {

      if(form.$valid){
        console.log('updateMedicalForm');
        console.log($scope.memorial);

        Memorial.update($scope.memorialKey,
          {
            letter_of_intent: {
              funeral: {
                grave_choice: 'aaa'
              },
              medical_care: {
                surviving_treatment: {

                  brain: $scope.memorial.letter_of_intent.medical_care.surviving_treatment.brain,
                  dying: $scope.memorial.letter_of_intent.medical_care.surviving_treatment.dying,
                  old: $scope.memorial.letter_of_intent.medical_care.surviving_treatment.old,

                  life_support: $scope.memorial.letter_of_intent.medical_care.surviving_treatment.life_support,
                  nutrition: $scope.memorial.letter_of_intent.medical_care.surviving_treatment.nutrition
                },

                agent: {
                  name_1: $scope.memorial.letter_of_intent.medical_care.agent.name_1,
                  relation_1: $scope.memorial.letter_of_intent.medical_care.agent.relation_1,
                  tel_1: $scope.memorial.letter_of_intent.medical_care.agent.tel_1,

                  name_2: $scope.memorial.letter_of_intent.medical_care.agent.name_2,
                  relation_2: $scope.memorial.letter_of_intent.medical_care.agent.relation_2,
                  tel_2: $scope.memorial.letter_of_intent.medical_care.agent.tel_2,
                }
              }
            }
          }
          
        ).then(function(){
          toaster.pop('success', null, "저장되었습니다");
          $scope.message = '.';
        });
      }
    };

    $scope.updateFuneralForm = function(form) {

    }

  });
