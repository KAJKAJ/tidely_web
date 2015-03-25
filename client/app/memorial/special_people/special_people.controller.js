'use strict';

angular.module('doresolApp')
  .controller('SpecialPeopleCtrl', function ($scope,Memorial,$stateParams,User,$state,$http,ENV,$firebase,Composite,toaster, Util) {
    
    $scope.memorialKey = $stateParams.id;
    $scope.memorial = Memorial.getCurrentMemorial();
    $scope.currentUser = User.getCurrentUser();

    $scope.copyMemorial = {};
    $scope.memorial.$loaded().then(function(value){
      angular.copy($scope.memorial,$scope.copyMemorial);
      
      if(!$scope.copyMemorial.special_people)$scope.copyMemorial.special_people = {};
      if(!$scope.copyMemorial.special_people.family)$scope.copyMemorial.special_people.family = {};
      if(!$scope.copyMemorial.special_people.friend)$scope.copyMemorial.special_people.friend = {};
      if(!$scope.copyMemorial.special_people.other)$scope.copyMemorial.special_people.other = {};
      
      $scope.isOwner = Memorial.isOwner();
      $scope.isMember = Memorial.isMember();
      $scope.isGuest = Memorial.isGuest();
    });

    $scope.newFamily = {};
    $scope.addNewFamilyFlag = false;

    $scope.newFriend = {};
    $scope.addNewFriendFlag = false;

    $scope.newOther = {};
    $scope.addNewOtherFlag = false;

    $scope.toggleAddNewFamilyFlag = function(){
      $scope.addNewFamilyFlag = !$scope.addNewFamilyFlag;
    }

    $scope.toggleAddNewFriendFlag = function(){
      $scope.addNewFriendFlag = !$scope.addNewFriendFlag;
    }

    $scope.toggleAddNewOtherFlag = function(){
      $scope.addNewOtherFlag = !$scope.addNewOtherFlag;
    }

    $scope.addNewFamily = function(){
      if(!$scope.copyMemorial.special_people.family){
        $scope.copyMemorial.special_people.family = {};
      }

      var key = Util.getUniqueId();

      $scope.copyMemorial.special_people.family[key] = $scope.newFamily;
      $scope.newFamily = {};
      $scope.toggleAddNewFamilyFlag();
    }

    $scope.addNewFriend = function(){
      if(!$scope.copyMemorial.special_people.friend){
        $scope.copyMemorial.special_people.friend = {};
      }

      var key = Util.getUniqueId();

      $scope.copyMemorial.special_people.friend[key] = $scope.newFriend;
      $scope.newFriend = {};
      $scope.toggleAddNewFriendFlag();
    }

    $scope.addNewOther = function(){
      if(!$scope.copyMemorial.special_people.other){
        $scope.copyMemorial.special_people.other = {};
      }

      var key = Util.getUniqueId();

      $scope.copyMemorial.special_people.other[key] = $scope.newOther;
      $scope.newOther = {};
      $scope.toggleAddNewOtherFlag();
    }

    $scope.removeItemFromObject = function(index, object){
      delete object[index];
    }

    $scope.updateMemorial = function(form){
      if(form.$valid){
        Memorial.update($scope.copyMemorial.$id,
          {
            name : $scope.copyMemorial.name,
            special_people : $scope.copyMemorial.special_people
          }
        ).then(function(){
          // $scope.message = '저장되었습니다.';
          toaster.pop('success', null, "저장되었습니다");
        });
      }
    }   

  });
