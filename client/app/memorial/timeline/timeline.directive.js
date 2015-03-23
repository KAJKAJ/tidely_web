'use strict';

angular.module('doresolApp')
  .directive('superboxList', function ($timeout,$compile,$http) {
    return {
      restrict: 'C',
      scope:{
        story: '=story',
        storyKey: '=storyKey',
        removeSelectedStory: '&',
        saveStory: '&',
        saveMessage: '='
      },
      templateUrl: 'app/memorial/timeline/superbox_list.html',
      link: function(scope, element, attrs) {
        element.on('click', function() {
          if(!scope.isRemoveClicked){
            angular.element('.superbox-show').remove();

            if(scope.$root.superboxToggled == scope.storyKey){
              $timeout(function(){
                scope.$root.superboxToggled = false;
              });
            } else{
              $timeout(function(){
                scope.$root.superboxToggled = scope.storyKey;
                var htmlElement = angular.element("<superbox-show></superbox-show>");
                element.after(htmlElement);
                $compile(element.next()[0])(scope);
                
              }); // timeout
            } // else 
          }else{
            scope.isRemoveClicked = false;
          }
        });
      },
      controller: function($scope){
        $scope.removeStory = function(){
          $scope.isRemoveClicked = true;
          $scope.removeSelectedStory();
        }
      }
    };
  })

  .directive('superboxShow', function () {
    return {
      restrict: 'E',
      // scope: false,
      scope: {
        story: '=',
        saveStoryDetail: '&',
        saveMessage:'='
      },
      replace: true,
      templateUrl: "app/memorial/timeline/superbox_show.html",
      controller: function($scope){
        $scope.changed = function(){
          // console.log($scope);
        }

        // $scope.mapDetails = {};
        // $scope.map = {
        //   center: {
        //       latitude: 45,
        //       longitude: -73
        //   },
        //   zoom: 8
        // };
      }
      // link: function(scope, element, attrs) {
      //  });
      }
  })
  
  // Slot List Directive
  .directive('slotList', function () {
    return {
      restrict: 'E',
      scope: false,
      templateUrl: "app/memorial/timeline/slot_list.html",
      // link: function(scope, element, attrs) {
      //  });
      }
  })

  // .directive('timelineImg', function() {
  //   return {
  //     restrict: 'E',
  //     replace: true,
  //     // transclude: true,
  //     scope: {
  //       storyKey: '@',
  //       memorialKey: '@',
  //       addComment: '&'
  //     },
  //     // templateUrl: "app/memorial/timeline/timeline_img.html",
  //     // controller:'StoryDetailCtrl'
  //     // controller: function($scope){
  //     //   console.log($scope);
  //     // }
  //   }
  // })

  .directive('storyDetail', function () {
    return {
      restrict: 'E',
      scope: {
        storyKey:'@',
        memorialKey:'@',
        addComment: '&'
      },
      // replace: true,
      templateUrl: "app/memorial/timeline/story_detail.html",
      controller:'StoryDetailCtrl'
    }
  })

  .directive('comments', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        storyKey: '@',
        memorialKey: '@',
        addComment: '&'
      },
      templateUrl: "app/memorial/timeline/comments.html",
      controller:'StoryDetailCtrl'
    }
  })

  .directive('storyList', function () {
    return {
      restrict: 'E',
      scope: false,
      templateUrl: "app/memorial/timeline/story_list.html",
      // link: function(scope, element, attrs) {
      //   element.on('click',function(){
      //     scope.selectedEra = 'new';
      //   });
      // }
    }
  });

