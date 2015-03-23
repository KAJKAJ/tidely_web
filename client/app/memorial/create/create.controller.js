'use strict';

angular.module('doresolApp')
  .controller('MemorialCreateCtrl', function ($scope,$rootScope, $state,Util,Composite,User) {
    $scope.today = Date.now();
    $scope.newMemorial = {};
    $scope.newMemorial.public = true;
    $scope.currentUser = User.getCurrentUser();

    $scope.createMemorial = function(form){
      if(form.$valid){
        var file = null;
        if($scope.newMemorial.lastUploadingFile){
          file = {
              location: 'local',
              url: '/tmp/' + $scope.newMemorial.lastUploadingFile,
              updated_at: moment().toString()
            }

            var memorial = {
                name: $scope.newMemorial.name,
                dateOfBirth: moment($scope.newMemorial.dateOfBirth).format("YYYY-MM-DD"),
                // dateOfDeath: moment($scope.newMemorial.dateOfDeath).format("YYYY-MM-DD"),
                dateOfDeath: moment().format("YYYY-MM-DD"),
                
                description: $scope.newMemorial.description?$scope.newMemorial.description:null,
                file:file,
                ref_user:$scope.currentUser.uid,
                public: $scope.newMemorial.public,
                count_timeline:0,
                count_storyline:0,
                count_member:1
            };
            
            Composite.createMemorial(memorial).then(function (value) {
              $state.transitionTo('memorial.storymap', {id: value.name(), mode: 'setting'});
            });
        }
      }
    }

    $scope.getFlowFileUniqueId = function(file){
      return $scope.currentUser.uid.replace(/[^\.0-9a-zA-Z_-]/img, '') + '-' + Util.getFlowFileUniqueId(file);
    }
   
    $scope.$on('flow::fileSuccess', function (event, $flow, flowFile, message) {
      $scope.fileUploading = false;
      $scope.newMemorial.lastUploadingFile = flowFile.uniqueIdentifier;
    });

    $scope.$on('flow::fileAdded', function (event, $flow, flowFile, message) {
      $scope.newMemorial.lastUploadingFile = null;
    });

    $scope.openDatepicker = function($event,variable) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope[variable] = true;

    }
  });
