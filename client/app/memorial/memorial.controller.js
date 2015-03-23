'use strict';

angular.module('doresolApp')
  .controller('MemorialCtrl', function ($scope,$stateParams,$state,Memorial,User,Util) {
    $scope.$state = $state;
    $scope.isMobile = Util.isMobile();

  	$scope.memorialKey = $stateParams.id;
		Memorial.setCurrentMemorial($scope.memorialKey);
		$scope.memorial = Memorial.getCurrentMemorial();
	  $scope.user = User.getCurrentUser();

		$scope.memorial.$loaded().then(function(value) {
			// role setting
			if($scope.user && $scope.user.uid === $scope.memorial.ref_user ) {
				Memorial.setMyRole('owner');
			} else {
				// no member 
				if($scope.memorial.members === undefined) {
					Memorial.setMyRole('guest');

				} else {
					// member
					if($scope.user && $scope.memorial.members[$scope.user.uid]) {
						Memorial.setMyRole('member');
					} else {
						Memorial.setMyRole('guest');
					}
				}
			}

			$scope.isGuest = Memorial.isGuest();
			$scope.isOwner = Memorial.isOwner();
			$scope.isMember = Memorial.isMember();

			// in case public and guest
			if(!$scope.memorial.public && Memorial.isGuest()){
				if($scope.user){
					$state.go('request', {memorialId: $scope.memorialKey, requesterId: $scope.user.uid});
				}else{
					alert('회원가입이 필요합니다.');
					$state.go('main');
				}
			}
		});

		var audio = document.getElementById("bg_music");
		if(audio){
			audio.volume = 0.3;
		}	
  });
