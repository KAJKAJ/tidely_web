'use strict';

angular.module('doresolApp')
  .controller('ProfileCtrl', function ($scope,$stateParams,Util,Composite,$state,User,Memorial) {
    $scope.today = Date.now();
    
    $scope.currentUser = User.getCurrentUser();
    $scope.memorialKey = $stateParams.id;
    $scope.memorial = Memorial.getCurrentMemorial();
    
    $scope.lastUploadingFile = null;

    $scope.copyMemorial = {};
		$scope.memorial.$loaded().then(function(value){
      angular.copy($scope.memorial,$scope.copyMemorial);

      $scope.isOwner = Memorial.isOwner();
      $scope.isMember = Memorial.isMember();
      $scope.isGuest = Memorial.isGuest();
    });

    $scope.newSchool = {};
    $scope.addNewSchoolFlag = false;

    $scope.toggleAddNewSchoolFlag = function(){
      $scope.addNewSchoolFlag = !$scope.addNewSchoolFlag;
    }

    $scope.addNewSchool = function(){
      if(!$scope.copyMemorial.school){
        $scope.copyMemorial.school = [];
      }
      $scope.copyMemorial.school.push($scope.newSchool);
      $scope.newSchool = {};
      $scope.toggleAddNewSchoolFlag();
    }

    $scope.updateMemorial = function(form){
    	if(form.$valid){
    		Memorial.update($scope.copyMemorial.$id,
    			{
    				name:$scope.copyMemorial.name,
    				dateOfBirth:moment($scope.copyMemorial.dateOfBirth).format("YYYY-MM-DD"),
    				// dateOfDeath:moment($scope.copyMemorial.dateOfDeath).format("YYYY-MM-DD"),
            dateOfDeath:moment().format("YYYY-MM-DD"),

            description: $scope.copyMemorial.description?$scope.copyMemorial.description:null,
            public:$scope.copyMemorial.public,

            wedding:$scope.copyMemorial.wedding
    			}
    		).then(function(){
    			$scope.message = '저장되었습니다.';
    		});
    	}
    }

    $scope.changeProfileImage = function(){
    	var file = null;
      if($scope.lastUploadingFile){
        file = {
          location: 'local',
          url: '/tmp/' + $scope.lastUploadingFile,
          updated_at: moment().toString()
        }
        $scope.memorial.file = file;
        Composite.changeMemorialProfileImage($scope.memorial).then(function (value) {
          $scope.lastUploadingFile = null;
        });
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

    $scope.openDatepicker = function($event,variable) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope[variable] = !$scope[variable];
      console.log($scope[variable]);
    }

    // public인데 guest가 가입코자 할때
    $scope.subscribe = function() {
      var params = {
        memorialId: $scope.memorialKey,
        inviterId: $scope.currentUser.uid,
        inviteeId: $scope.currentUser.uid
      };
      Composite.addMember(params).then(function(){
        Memorial.setMyRole('member');
        $scope.isMember = Memorial.isMember();
        $scope.isGuest = Memorial.isGuest();
        $scope.isOwner = Memorial.isOwner();
        // $state.go('memorial.storyline', {id: $scope.memorialKey})
        $state.transitionTo('memorial.storyline', {id: $scope.memorialKey}, {'reload':true});
      });
    }
  });
