'use strict';

angular.module('doresolApp')
  .controller('LoiCtrl', function ($scope,Memorial,$stateParams,User,$state,$http,ENV,$firebase,Composite,toaster) {

  	// console.log('ProfileCtrl');
    $scope.memorialKey = $stateParams.id;
    $scope.memorial = Memorial.getCurrentMemorial();
    $scope.currentUser = User.getCurrentUser();

    $scope.users = User.getUsersObject();

    $scope.memorial.$loaded().then(function(value) {
      $scope.leader = User.findById($scope.memorial.ref_user);

      if (!$scope.memorial.letter_of_intent) $scope.memorial.letter_of_intent = {};
      if (!$scope.memorial.letter_of_intent.funeral) $scope.memorial.letter_of_intent.funeral = {};
      if (!$scope.memorial.letter_of_intent.funeral.notice) $scope.memorial.letter_of_intent.funeral.notice = null;
      if (!$scope.memorial.letter_of_intent.funeral.guide) $scope.memorial.letter_of_intent.funeral.guide = null;
      if (!$scope.memorial.letter_of_intent.funeral.religion) $scope.memorial.letter_of_intent.funeral.religion = null;
      if (!$scope.memorial.letter_of_intent.funeral.duration) $scope.memorial.letter_of_intent.funeral.duration = null;
      if (!$scope.memorial.letter_of_intent.funeral.donation) $scope.memorial.letter_of_intent.funeral.donation = null;
      if (!$scope.memorial.letter_of_intent.funeral.food) $scope.memorial.letter_of_intent.funeral.food = null;
      if (!$scope.memorial.letter_of_intent.funeral.body) $scope.memorial.letter_of_intent.funeral.body = null;

      if (!$scope.memorial.letter_of_intent.medical_care) $scope.memorial.letter_of_intent.medical_care = {};
      if (!$scope.memorial.letter_of_intent.medical_care.agent) $scope.memorial.letter_of_intent.medical_care.agent = {};
      if (!$scope.memorial.letter_of_intent.medical_care.agent.name_1) $scope.memorial.letter_of_intent.medical_care.agent.name_1 = null;
      if (!$scope.memorial.letter_of_intent.medical_care.agent.relation_1) $scope.memorial.letter_of_intent.medical_care.agent.relation_1 = null;
      if (!$scope.memorial.letter_of_intent.medical_care.agent_tel_1) $scope.memorial.letter_of_intent.medical_care.agent_tel_1 = null;
      if (!$scope.memorial.letter_of_intent.medical_care.agent.name_2) $scope.memorial.letter_of_intent.medical_care.agent.name_2 = null;
      if (!$scope.memorial.letter_of_intent.medical_care.agent.relation_2) $scope.memorial.letter_of_intent.medical_care.agent.relation_2 = null;
      if (!$scope.memorial.letter_of_intent.medical_care.agent_tel_2) $scope.memorial.letter_of_intent.medical_care.agent_tel_2 = null;

      if (!$scope.memorial.letter_of_intent.medical_care.surviving_treatment) $scope.memorial.letter_of_intent.medical_care.surviving_treatment = {};
      if (!$scope.memorial.letter_of_intent.medical_care.surviving_treatment.brain) $scope.memorial.letter_of_intent.medical_care.surviving_treatment.brain = null;
      if (!$scope.memorial.letter_of_intent.medical_care.surviving_treatment.dying) $scope.memorial.letter_of_intent.medical_care.surviving_treatment.dying = null;
      if (!$scope.memorial.letter_of_intent.medical_care.surviving_treatment.old) $scope.memorial.letter_of_intent.medical_care.surviving_treatment.old = null;
      if (!$scope.memorial.letter_of_intent.medical_care.surviving_treatment.life_support) $scope.memorial.letter_of_intent.medical_care.surviving_treatment.life_support = null;
      if (!$scope.memorial.letter_of_intent.medical_care.surviving_treatment.nutrition) $scope.memorial.letter_of_intent.medical_care.surviving_treatment.nutrition = null;

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

                  brain: $scope.memorial.letter_of_intent.medical_care.surviving_treatment.brain ?
                        $scope.memorial.letter_of_intent.medical_care.surviving_treatment.brain : 0,
                  dying: $scope.memorial.letter_of_intent.medical_care.surviving_treatment.dying ?
                        $scope.memorial.letter_of_intent.medical_care.surviving_treatment.dying : 0,
                  old: $scope.memorial.letter_of_intent.medical_care.surviving_treatment.old ? 
                        $scope.memorial.letter_of_intent.medical_care.surviving_treatment.old : 0,

                  life_support: $scope.memorial.letter_of_intent.medical_care.surviving_treatment.life_support ?
                                $scope.memorial.letter_of_intent.medical_care.surviving_treatment.life_support : 0,
                  nutrition: $scope.memorial.letter_of_intent.medical_care.surviving_treatment.nutrition ?
                              $scope.memorial.letter_of_intent.medical_care.surviving_treatment.nutrition : 0
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
