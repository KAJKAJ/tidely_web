'use strict';

angular.module('doresolApp')
  .controller('StoryDetailCtrl', function ($scope,$stateParams,$state,Story,Memorial,Composite,ENV,$firebase, User,Comment, ngDialog) {

  	$scope.init = function(storyKey,memorialkey){
      if(storyKey){
        $scope.memorialKey = memorialkey;
        $scope.storyKey = storyKey;
        _initialize();
      }
    }

    $scope.memorial = Memorial.getCurrentMemorial();
    $scope.memorialKey = $scope.memorial.$id;

    var _initialize = function(){
      $scope.story = Story.findByIdInMemorial($scope.memorialKey,$scope.storyKey);
      $scope.commentsObject = {};
      $scope.currentUser = User.getCurrentUser();
      // console.log($scope.currentUser);
      $scope.users = User.getUsersObject();
      $scope.newComment = {};

      $scope.commentsTotalCnt = 0;

      $scope.story.$loaded().then(function(value){
        $scope.isMember = Memorial.isMember();
        $scope.isGuest = Memorial.isGuest();
        $scope.isOwner = Memorial.isOwner();

        var storyCommentsRef = new Firebase(ENV.FIREBASE_URI + '/memorials/' + value.ref_memorial + '/stories/'+value.$id + '/comments/');
        var _comments = $firebase(storyCommentsRef).$asArray();
        
        var commentsRef = new Firebase(ENV.FIREBASE_URI + '/comments');

        _comments.$watch(function(event){
          switch(event.event){
            case "child_removed":
              delete $scope.commentsObject[$scope.story.$id][event.key];
              $scope.commentsTotalCnt--;
            break;
            case "child_added":
              var childRef = commentsRef.child(event.key);
              var child = $firebase(childRef).$asObject();
              child.$loaded().then(function(valueComment){
                valueComment.fromNow = moment(valueComment.created_at).fromNow();
                if($scope.commentsObject[$scope.storyKey] == undefined) $scope.commentsObject[$scope.storyKey] = {};
                $scope.commentsObject[$scope.storyKey][event.key] = valueComment;
                User.setUsersObject(valueComment.ref_user);
              });
              $scope.commentsTotalCnt ++;
            break;
          }
        });

      });
    }

    _initialize();
    
    $scope.modalComment = function() {
      ngDialog.openConfirm({ 
        template: '/app/memorial/comment/comment.html',
        // controller: 'StoryDetailCtrl',
        scope: $scope,
        className:'ngdialog-theme-large'
      }).then(function (value) {
        // console.log('Modal promise resolved. Value: ', value);
      }, function(reason) {
        // console.log('Modal promise rejected. Reason: ', reason);
      });
    }

    $scope.addComment = function(storyKey,comment){
      if(comment.body){
        Composite.createCommentFromStoryInMemorial($scope.memorialKey,storyKey,comment);
        $scope.newComment = {}; 
      }
    }

    $scope.deleteComment = function(storyKey, commentKey) {
      delete $scope.commentsObject[storyKey][commentKey];
      Comment.removeCommentFromStoryInMemorial($scope.memorialKey, storyKey, commentKey);
    }
  });
