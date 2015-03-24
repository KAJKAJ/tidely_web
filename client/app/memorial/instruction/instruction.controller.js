'use strict';

angular.module('doresolApp')
  .controller('InstructionCtrl', function ($scope,Memorial,$stateParams,User,$state,$http,ENV,$firebase,Composite,toaster, Util) {
    
    $scope.memorialKey = $stateParams.id;
    $scope.memorial = Memorial.getCurrentMemorial();
    $scope.currentUser = User.getCurrentUser();

    $scope.newInstruction = {};
    $scope.peopleOption = [];

    $scope.memorial.$loaded().then(function(value){
      $scope.isOwner = Memorial.isOwner();
      $scope.isMember = Memorial.isMember();
      $scope.isGuest = Memorial.isGuest();

      angular.forEach($scope.memorial.special_people.family, function(value, key) {
        $scope.peopleOption.push(value);
      });
      angular.forEach($scope.memorial.special_people.friend, function(value, key) {
        $scope.peopleOption.push(value);
      });
      angular.forEach($scope.memorial.special_people.other, function(value, key) {
        $scope.peopleOption.push(value);
      });
    });

    $scope.instructionArray = [];
    $scope.instructionObject = {};

    var instrucionRef = new Firebase(ENV.FIREBASE_URI + '/memorials/' + $scope.memorialKey + '/instruction');
    var instruction = $firebase(instrucionRef).$asArray();

    instruction.$watch(function(event){
      switch(event.event){
        case "child_removed":
          var index = $scope.instructionArray.indexOf(event.key);
          if( index >= 0) {
            $scope.instructionArray.splice(index, 1);
            delete $scope.instructionObject[event.key];
          }
          break;
        case "child_added":
          var childRef = instrucionRef.child(event.key);
          var child = $firebase(childRef).$asObject();

          child.$loaded().then(function(value){
            value.fromNow = moment(value.created_at).fromNow();
            $scope.instructionArray.push(value.$id);
            $scope.instructionObject[value.$id] = value;

            $scope.instructionArray.sort(function(aKey,bKey){
              var aValue = $scope.instructionObject[aKey];
              var bValue = $scope.instructionObject[bKey];
              var aCreatedAt = moment(aValue.created_at).unix();
              var bCreatedAt  = moment(bValue.created_at).unix();
              return aCreatedAt < bCreatedAt ? 1 : -1;
            });
          });
          break;
      }
    });

    $scope.createNewInstruction = function(form){
      if(form.$valid){
        $scope.newInstruction.created_at = moment().toString();
        Memorial.createInstruction($scope.memorialKey,$scope.newInstruction).then(function(value){
          toaster.pop('success', null, "저장되었습니다");
          $scope.newInstruction = {};
        });
      }
    }

    $scope.removeInstruction = function(instructionKey){
      Memorial.removeInstruction($scope.memorialKey,instructionKey).then(function(value){
        toaster.pop('success', null, "삭제되었습니다");
      });
    }

  });
