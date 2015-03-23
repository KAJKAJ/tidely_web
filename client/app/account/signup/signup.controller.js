'use strict';

angular.module('doresolApp')
  .controller('SignupCtrl', function ($scope, Auth, User, $stateParams, $state, Composite) {
    $scope.user = {};
    $scope.errors = {};

    $scope.register = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.register($scope.user).then(function (value){

          if($state.params.memorialId !== undefined) {
            Composite.addMember($state.params).then(function(){
              $state.go("memorials");
            });
          } else {
            $state.go('memorials');
          }


        }, function(error){
          var errorCode = error.code;
          $scope.errors = {};
          console.log(error);
          switch(errorCode){
            case "EMAIL_TAKEN":
              form['email'].$setValidity('firebase',false);
              $scope.errors['email'] = '이미 등록된 이메일 주소입니다.';
            break;
          }
          
        });
      }
    };

    $scope.toLogin = function() {
      if($state.params.memorialId !== undefined) {
        $state.go('login.invites', {memorialId: $state.params.memorialId, inviterId: $state.params.inviterId});
      } else {
        $state.go('login');
      }
    }
  });