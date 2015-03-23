'use strict';

angular.module('doresolApp')
  .controller('MemberCtrl', function ($scope,Memorial,$stateParams,User,$state,$http,ENV,$firebase,Composite) {
  	// console.log('ProfileCtrl');
    $scope.memorialKey = $stateParams.id;
    $scope.memorial = Memorial.getCurrentMemorial();
    $scope.currentUser = User.getCurrentUser();

    $scope.users = User.getUsersObject();
    $scope.members = {};
    $scope.waitings = {};
    $scope.watingsCnt = 0;
    // generate invites url
    if($scope.user){
  		var longUrl = {
      	"longUrl" : ENV.HOST + "/invites/" + $scope.memorialKey + "/" + $scope.currentUser.uid
      };
      // console.log(longUrl);
      $http.post(ENV.GOOGLE_API_URI, angular.toJson(longUrl)).success(function (data) {
      	$scope.inviteUrl = data.id;
      });
    }

    $scope.memorial.$loaded().then(function(value) {
      $scope.leader = User.findById($scope.memorial.ref_user);
      User.setUsersObject($scope.memorial.ref_user);
    });

    var userMembersRef =  new Firebase(ENV.FIREBASE_URI + '/users');
    var memorialMembersRef =  new Firebase(ENV.FIREBASE_URI + '/memorials/'+$scope.memorialKey+'/members');
    var _members = $firebase(memorialMembersRef).$asArray();

    _members.$watch(function(event){
      switch(event.event){
        case "child_removed":
          delete $scope.members[event.key];
          break;
        case "child_added":
          var childRef = userMembersRef.child(event.key);
          var child = $firebase(childRef).$asObject();
          child.$loaded().then(function(value){
            $scope.members[value.uid] = value;
            User.setUsersObject(value.uid);
          });
        break;
      }
    });

    var memorialWaitingsRef =  new Firebase(ENV.FIREBASE_URI + '/memorials/'+$scope.memorialKey+'/waitings');
    var _waitings = $firebase(memorialWaitingsRef).$asArray();
    _waitings.$watch(function(event){
      switch(event.event){
        case "child_removed":
          $scope.watingsCnt--;
          delete $scope.waitings[event.key];
          break;
        case "child_added":
          $scope.watingsCnt++;
          var childRef = userMembersRef.child(event.key);
          var child = $firebase(childRef).$asObject();
          child.$loaded().then(function(value){
            $scope.waitings[value.uid] = value;
            User.setUsersObject(value.uid);
          });
        break;
      }
    });

    // remove member from member list
    $scope.removeMember = function(uid, role) {
      var index = _members.$indexFor(uid);
      _members.$remove(index);

      var userMembersRef =  new Firebase(ENV.FIREBASE_URI + '/users/' + uid + '/memorials/members');
      $firebase(userMembersRef).$remove($scope.memorialKey).then(function(value){
        if(role == 'member') $state.go('memorials');          
      }, function(error) {
        console.log(error);

      });
    };

    // from waiting list to member list
    $scope.moveMember = function(uid) {
      // var index = _waitings.$indexFor(uid);
      // _waitings.$remove(index);

      var params = { memorialId: $scope.memorialKey, inviteeId: uid} ;
      Composite.addMember(params).then(function(){
        var removeParams = {
            memorialId: $scope.memorialKey,
            requesterId: uid
        };
        Composite.removeWaiting(removeParams).then(function(value){
        })
      }, function(error){
        console.log(error);

      })
    };

  });

