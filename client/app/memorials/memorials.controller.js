'use strict';

angular.module('doresolApp')
  .controller('MemorialsCtrl', function ($scope, $resource, Auth, Memorial, User, $state,Util) {
    $scope.isMobile = Util.isMobile();
	$scope.user = User.getCurrentUser();
    
    $scope.myWaitingCnt = 0;

    $scope.myMemorials = Memorial.getMyMemorials();
    Memorial.fetchMyWaitingMemorials($scope.user.uid);

    $scope.myWaitingMemorials={};
    $scope.myWaitingMemorials = Memorial.getMyWaitingMemorials();
    
    $scope.isEmptyObject = function(obj){
    	return (Object.getOwnPropertyNames(obj).length === 0);
		}
	});
