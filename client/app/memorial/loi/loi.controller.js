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
      $scope.leader = User.findById($scope.memorial.ref_user);

      
      if ($scope.memorial.letter_of_intent == null) {
        $scope.memorial.letter_of_intent = {};
      }
      if ($scope.memorial.letter_of_intent.funeral == null) {
        $scope.memorial.letter_of_intent.funeral = {};
      }
      if ($scope.memorial.letter_of_intent.medical_care == null) {
        $scope.memorial.letter_of_intent.medical_care = {};
      }
      User.setUsersObject($scope.memorial.ref_user);
    });

    $scope.changeItem = function( item, selectNum ) {

      switch(item) {
        case 'notice':
          $scope.memorial.letter_of_intent.funeral.notice = selectNum;
          break;
        case 'guide':
          $scope.memorial.letter_of_intent.funeral.guide = selectNum;
          break;
        case 'religion':
          $scope.memorial.letter_of_intent.funeral.religion = selectNum;
          break;
        case 'duration':
          $scope.memorial.letter_of_intent.funeral.duration = selectNum;
          break;
        case 'donation':
          $scope.memorial.letter_of_intent.funeral.donation = selectNum;
          break;
        case 'food':
          $scope.memorial.letter_of_intent.funeral.food = selectNum;
          break;
        case 'body':
          $scope.memorial.letter_of_intent.funeral.body = selectNum;
          break;
        default:
          break;
      };
    }

    // from waiting list to member list
    $scope.updateForm = function(form) {

      if(form.$valid){

        Memorial.update($scope.memorialKey,
          {
            letter_of_intent: {
              funeral: {
                notice: $scope.memorial.letter_of_intent.funeral.notice ?
                        $scope.memorial.letter_of_intent.funeral.notice : 0,
                guide: $scope.memorial.letter_of_intent.funeral.guide ?
                        $scope.memorial.letter_of_intent.funeral.guide : 0,
                religion: $scope.memorial.letter_of_intent.funeral.religion ?
                        $scope.memorial.letter_of_intent.funeral.religion : 0,
                duration: $scope.memorial.letter_of_intent.funeral.duration ?
                        $scope.memorial.letter_of_intent.funeral.duration : 0,
                donation: $scope.memorial.letter_of_intent.funeral.donation ?
                        $scope.memorial.letter_of_intent.funeral.donation : 0,
                food: $scope.memorial.letter_of_intent.funeral.food ?
                        $scope.memorial.letter_of_intent.funeral.food : 0,
                body: $scope.memorial.letter_of_intent.funeral.body ?
                        $scope.memorial.letter_of_intent.funeral.body : 0
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
                  name_1: $scope.memorial.letter_of_intent.medical_care.agent.name_1 ? 
                          $scope.memorial.letter_of_intent.medical_care.agent.name_1: '',
                  relation_1: $scope.memorial.letter_of_intent.medical_care.agent.relation_1 ?
                          $scope.memorial.letter_of_intent.medical_care.agent.relation_1: '',
                  tel_1: $scope.memorial.letter_of_intent.medical_care.agent.tel_1 ? 
                          $scope.memorial.letter_of_intent.medical_care.agent.tel_1: '',
                  name_2: $scope.memorial.letter_of_intent.medical_care.agent.name_2 ? 
                            $scope.memorial.letter_of_intent.medical_care.agent.name_2: '',
                  relation_2: $scope.memorial.letter_of_intent.medical_care.agent.relation_2 ?
                              $scope.memorial.letter_of_intent.medical_care.agent.relation_2: '',
                  tel_2: $scope.memorial.letter_of_intent.medical_care.agent.tel_2 ?
                          $scope.memorial.letter_of_intent.medical_care.agent.tel_2: '',
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

  });
