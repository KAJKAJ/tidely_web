'use strict';

angular.module('doresolApp')
  .controller('AgencyCtrl', function ($rootScope, $scope, ENV, $firebase, User, ngDialog, $timeout) {
    $scope.isLoggedIn = false;
    $scope.user = null;
    $scope.newRequest = {};
    $scope.newRequest.usb = 0;
    $scope.newRequest.dvd = 0;

  	$scope.estimate = {};
  	
  	$scope.estimate.img = 50;
  	$scope.estimate.dvd = 0;
  	$scope.estimate.usb = 0;
  	$scope.estimate.tot = ($scope.estimate.img * 200 + $scope.estimate.dvd * 10000 + $scope.estimate.usb * 10000) / 10000;

		$scope.changeTot = function() {
      var image = $scope.estimate.img / 50;
      if(image < 1) image = 1;
      image = Math.floor(image);
      $scope.estimate.tot = (image*10000 + $scope.estimate.dvd * 10000 + $scope.estimate.usb * 10000) / 10000;
		}

    var setUserName = function(){
      $scope.newRequest.name = $scope.user.profile.name;
    }

    var setUserEmail = function(){
      if($scope.user.$id.indexOf("facebook") > -1){
        $scope.newRequest.email = $scope.user.thirdPartyUserData.email;
      }else if($scope.user.$id.indexOf("simplelogin") > -1){
        $scope.newRequest.email = $scope.user.email;
      }
    }

    $scope.$watch(function(){return User.getCurrentUser();}, 
      function (newValue) {
        if(newValue !== null) {
          $scope.isLoggedIn = true;
          $scope.user = User.getCurrentUser();
          setUserName();
          setUserEmail();
        } else {
          $scope.isLoggedIn = false;
        }
    }, true);

    $scope.checkLogin = function(){
      if(!$scope.isLoggedIn){
        $rootScope.modalOpen = true;
        $rootScope.toState = 'agency';

        ngDialog.openConfirm({ 
          template: '/app/account/login/login_modal.html',
          controller: 'MainCtrl',
          className: 'ngdialog-theme-default',
          scope: $scope
        }).then(function (value) {
          // console.log('Modal promise resolved. Value: ', value);
        }, function(reason) {
          // console.log('Modal promise rejected. Reason: ', reason);
          window.location.reload(); 
        });
      }
    }

    $scope.createRequest = function(form){
      if(form.$valid){
        $scope.newRequest.ref_user = $scope.user.$id;
        
        var ref = new Firebase(ENV.FIREBASE_URI + '/agency/request');
        var requests = $firebase(ref);
        requests.$push($scope.newRequest).then(function(value){
          $scope.newRequest = {};
          $scope.newRequestForm.$setPristine();
          setUserName();
          setUserEmail();
          $scope.saveMessage = {};
          $scope.saveMessage.success = true;
          $scope.saveMessage.text = '신청이 정상 처리되었습니다.';
          // $timeout(function(){
          //   $scope.saveMessage = {};
          // },5000);
        },function(error){
          $scope.saveMessage.success = false;
          $scope.saveMessage.text = '오류가 발생되었습니다. 잠시 후 다시 시도해 주세요.';
          // $timeout(function(){
          //   $scope.saveMessage = {};
          // },10000);
        });
      }
    }
});
