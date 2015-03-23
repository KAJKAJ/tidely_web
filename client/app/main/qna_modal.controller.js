'use strict';

angular.module('doresolApp')
  .controller('QnaModalCtrl', function ($scope, $modalInstance, paramFromDialogName, paramFromDialogObject, User, ENV, $firebase) {
  
  $scope.currentUser = User.getCurrentUser();
  $scope[paramFromDialogName] = paramFromDialogObject;
  // console.log($scope);

  $scope.ok = function () {
    $modalInstance.close($scope[paramFromDialogName]);
  }

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  }

  $scope.newReply = {};

  $scope.addReply = function(qnaId,reply){
    var ref = new Firebase(ENV.FIREBASE_URI + '/qna/'+qnaId+'/reply/');
  	var _reply = $firebase(ref);

  	reply.created_at = moment().toString();
    reply.updated_at = reply.created_at;
    reply.ref_user = User.getCurrentUser().uid;

    _reply.$push(reply).then(function(){
    	$scope.newReply = {};
    });
  }

  $scope.deleteReply = function(qnaId,replyId){
  	var ref = new Firebase(ENV.FIREBASE_URI + '/qna/'+qnaId+'/reply/');
  	var _reply = $firebase(ref);
  	_reply.$remove(replyId);
  }
  // console.log($scope.parent.replyObject[qna.$id]);
});
