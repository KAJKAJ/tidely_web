'use strict';

angular.module('doresolApp')
  .controller('SettingsCtrl', function ($scope, User, Auth, Util, Composite) {
    $scope.isMobile = Util.isMobile();
    $scope.errors = {};
    $scope.currentUser = User.getCurrentUser();
    $scope.password = {};
    
    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.currentUser.email,$scope.password.oldPassword, $scope.password.newPassword )
        .then( function() {
          $scope.passwordMessage = '성공적으로 변경되었습니다.';
        })
        .catch( function() {
          form.password.$setValidity('firebase', false);
          $scope.errors.other = '변경 전 암호가 정확하지 않습니다.';
          $scope.passwordMessage = '';
        });
      }
		}

    $scope.changeProfile = function(form){
      if(form.$valid){
        if($scope.lastUploadingFile){
          var file = null;
          file = {
            location: 'local',
            url: '/tmp/' + $scope.lastUploadingFile,
            updated_at: moment().toString()
          }
          $scope.currentUser.profile.file = file;
          Composite.updateUserProfileWithFile($scope.currentUser).then(function(){
            $scope.profileMessage = '성공적으로 변경되었습니다.';
          });
        }else{
          User.update($scope.currentUser.uid,{profile:$scope.currentUser.profile}).then(function(){
            $scope.profileMessage = '성공적으로 변경되었습니다.';
          });
        }
      }
    }

    $scope.getFlowFileUniqueId = function(file){
      return $scope.currentUser.uid.replace(/[^\.0-9a-zA-Z_-]/img, '') + '-' + Util.getFlowFileUniqueId(file);
    }

    $scope.$on('flow::fileSuccess', function (event, $flow, flowFile, message) {
      $scope.fileUploading = false;
      $scope.lastUploadingFile = flowFile.uniqueIdentifier;
    });

    $scope.$on('flow::fileAdded', function (event, $flow, flowFile, message) {
      $scope.lastUploadingFile = null;
    });

  });
