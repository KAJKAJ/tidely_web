'use strict';

angular.module('doresolApp')
  .controller('TimelineCtrl', function ($scope, $q, Util, Composite,Memorial,$stateParams,User,Story,$state, ENV, $firebase,$timeout) {

    $scope.editMode = false;
    $scope.newStoryCnt = 0;
    $scope.currentUser = User.getCurrentUser();

    $scope.totalStoryCnt = 0;
    $scope.isChanged = false;

    // $scope.waitStoryLoaded = function(){
    //   // console.log('--');
    //   console.log($scope.totalStoryCnt);
    //   console.log($scope.storyCnt);
    //   if($scope.totalStoryCnt == $scope.storyCnt){
    //     if($scope.totalStoryCnt > 0){
    //       // $scope.toggleEditMode();
    //       $scope.isChanged = false;
    //       $scope.createTimeline();
    //       if($scope.currentUser.uid == $scope.memorial.ref_user){
    //         $scope.toggleEditMode();
    //       }
    //     }else{
    //       if($scope.currentUser.uid == $scope.memorial.ref_user){
    //         $scope.toggleEditMode();
    //       }
    //     }
    //   }else{
    //     $timeout($scope.waitStoryLoaded(), 100);
    //   }
    // }
    $scope.waitStoryLoaded = function(){
      if($scope.totalStoryCnt == $scope.storyCnt){
        if($scope.totalStoryCnt > 0){
          // $scope.toggleEditMode();
          $scope.isChanged = false;
          $scope.createTimeline();
          if($scope.currentUser.uid == $scope.memorial.ref_user){
            $scope.toggleEditMode();
          }

        }else{
          if($scope.user && $scope.currentUser.uid == $scope.memorial.ref_user){
            $scope.toggleEditMode();
          }
        }
      }else{
        $timeout($scope.waitStoryLoaded(), 100);
      }
    };

    $scope.memorialKey = $stateParams.id;
    $scope.memorial = Memorial.getCurrentMemorial();

    $scope.memorial.$loaded().then(function(value){

      $scope.isOwner = Memorial.isOwner();
      $scope.isMember = Memorial.isMember();
      $scope.isGuest = Memorial.isGuest();

      //set default tab for era
      if(value.timeline && value.timeline.era){
        var firstEraKey = null;
        for (var key in value.timeline.era) {
            firstEraKey = key;
            break;
        }
        if(firstEraKey){
          $scope.setSelectedEra(firstEraKey,$scope.memorial.timeline.era[firstEraKey]);
        }
      }else{
        $scope.setSelectedEra("tempKey",{});
      }
      $scope.waitStoryLoaded();  
    });

    // $scope.selectedEraKey = {};
    $scope.selectedEra = {};
    
    $scope.storiesArray = {};
    $scope.storiesObject = {};

    $scope.sortableOptions = {
      // containment: "parent",
      cursor: "move",
      tolerance: "pointer",

      start: function(e, ui) {
        // $(e.target).data("ui-sortable").floating = true;
      },
      
      // After sorting is completed
      stop: function(e, ui) {
        // for (var i=0; i< $scope.storiesArray[$scope.selectedEraKey].length; i++) {
          
        // };
        $scope.isChanged = true;
      }
    };

    var storiesRef = new Firebase(ENV.FIREBASE_URI + '/stories');
    var currentTimelineStoriesRef =  new Firebase(ENV.FIREBASE_URI + '/memorials/'+$scope.memorialKey+'/timeline/stories');
    var _timelineStories = $firebase(currentTimelineStoriesRef).$asArray();

    $scope.storyCnt = 0;
    _timelineStories.$loaded().then(function(value){
      $scope.totalStoryCnt = _timelineStories.length;
      // console.log($scope.totalStoryCnt);
    });

    _timelineStories.$watch(function(event){
      switch(event.event){
        case "child_removed":
          $scope.storyCnt--;
          // removeMyMemorial(event.key);
          break;
        case "child_added":
          var childRef = storiesRef.child(event.key);
          var child = $firebase(childRef).$asObject();
          child.$loaded().then(function(value){
            // console.log(value);
            // $scope.timelineStories[event.key] = value;
            if($scope.storiesArray[value.ref_era] == undefined) {
              $scope.storiesArray[value.ref_era] = [];
              $scope.storiesObject[value.ref_era] = {};
            };
            $scope.storiesArray[value.ref_era].push(event.key);
            $scope.storiesObject[value.ref_era][event.key] = value;  
            
            // new object case delete it
            if(value.newStory) {
              delete $scope.storiesObject[value.ref_era][value.tempKey];
              var index = $scope.storiesArray[value.ref_era].indexOf(value.tempKey);
              $scope.storiesArray[value.ref_era].splice(index, 1);
            }
            
            $scope.storiesArray[value.ref_era].sort(function(aKey,bKey){
              var aValue = $scope.storiesObject[value.ref_era][aKey];
              var bValue = $scope.storiesObject[value.ref_era][bKey];
              var aStartDate = moment(aValue.startDate).unix();
              var bStartDate = moment(bValue.startDate).unix();
              return aStartDate > bStartDate ? 1 : -1;
            });

            // $scope.stories[value.ref_era][event.key] = true;

            value.$bindTo($scope, "storiesObject['"+value.ref_era+"']['"+event.key+"']").then(function(){
              $scope.storiesObject[value.ref_era][event.key].newStory = false;
              $scope.storyCnt++;
              // console.log($scope.storyCnt);
              if($scope.totalStoryCnt > 0){
                if($scope.totalStoryCnt == $scope.storyCnt){
                  if($scope.user && $scope.currentUser.uid != $scope.memorial.ref_user){
                    $scope.createTimeline();
                  }else{
                    $scope.createTimeline();
                  }
                }
              }
              // console.log($scope.storiesObject[value.ref_era][event.key]);
            });  
            // console.log($scope.storiesArray);          
          });
        break;
      }
    });

    $scope.selectedEraHeadlineChange = function(){
      var isDuplicated = false;

      if($scope.memorial.timeline) {
        angular.forEach($scope.memorial.timeline.era, function(era, key) {
          if(key!=$scope.selectedEraKey && era.headline == $scope.selectedEra.headline) {
            isDuplicated = true;
          }
        });
      }

      if(isDuplicated){
        $scope.eraForm.headline.$setValidity("duplicated",false);
      }else{
        $scope.eraForm.headline.$setValidity("duplicated",true);
      }
    };

    $scope.getSelectedEraKey = function(){
      return $scope.selectedEraKey;
    };

    $scope.setSelectedEra = function(key, era){
      $scope.selectedEraKey = key;
      angular.copy(era, $scope.selectedEra);
      // $scope.stories = [];
      if(key == 'tempKey' && $scope.eraForm){
        $scope.eraForm.$setPristine();
      }else{
        /*
        $scope.stories[$scope.selectedEraKey] = [];
        
        angular.forEach($scope.timelineStories,function(value,key){
          if(value.ref_era == $scope.selectedEraKey){
            $scope.stories[$scope.selectedEraKey].push(value);
          }
        });
        */
      }
    }

    $scope.removeSelectedEra = function(key){
      $scope.selectedEraKey = null;
      $scope.selectedEra = {};

      Memorial.removeEra($scope.memorialKey,key);
      // todo : should delete stories referenced
      //
    }

    var waitSubmittedEraLoaded = function(eraKey){
      if($scope.memorial.timeline.era[eraKey]){
        $scope.setSelectedEra(eraKey,$scope.memorial.timeline.era[eraKey]);
      }else{
        $timeout(waitSubmittedEraLoaded, 100);
      }
    }

    $scope.submitEra = function(form) {
      if(form.$valid) {

        $scope.selectedEra.startDate = moment($scope.selectedEra.startDate).format('YYYY-MM-DD');
        $scope.selectedEra.endDate = moment($scope.selectedEra.endDate).format('YYYY-MM-DD');

        if($scope.selectedEraKey == 'tempKey') {
          Memorial.createEra($scope.memorialKey, $scope.selectedEra).then(function(value){
            var newEraKey = value.name();
            $scope.selectedEra = {}
            $scope.selectedEraKey = null;
            $scope.eraForm.$setPristine();
            waitSubmittedEraLoaded(newEraKey);
          });
        } else {
          Memorial.updateEra($scope.memorialKey, $scope.selectedEraKey, $scope.selectedEra);
        }
      }
    };

    $scope.openDatepicker = function($event,variable) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope[variable] = true;

    };

    $scope.getFlowFileUniqueId = function(file){
      return $scope.currentUser.uid.replace(/[^\.0-9a-zA-Z_-]/img, '') + '-' + Util.getFlowFileUniqueId(file,$scope.currentUser);
    };
    
    $scope.removeSelectedStory = function(storyId) {
      $scope.totalStoryCnt--;
      // delete $scope.storiesObject[$scope.selectedEraKey][storyId];
      var index = $scope.storiesArray[$scope.selectedEraKey].indexOf(storyId);
      $scope.storiesArray[$scope.selectedEraKey].splice(index, 1);  

      if(!$scope.storiesObject[$scope.selectedEraKey][storyId].newStory){
        Story.removeStoryFromTimeline($scope.memorialKey,storyId);
      }
    };

    $scope.createTimeline = function(){
      var timeline_data = {
        "timeline": {
           "headline": $scope.memorial.name,
           "type":"default",
           // "text": $scope.memorial.name + "님의 Timeline",
           "text": "님의 타임라인입니다..",
           "startDate": $scope.memorial.dateOfBirth,
           "asset": {
                        "media": $scope.memorial.file.url
                    }            
        }
      };

      var timeline_dates = [];
      angular.forEach($scope.storiesArray,function(storiesKey,eraKey){
        angular.forEach(storiesKey,function(storyKey){
          timeline_dates.push($scope.storiesObject[eraKey][storyKey]);
        });
      });

      var timeline_eras = [];
      if($scope.memorial.timeline){
        angular.forEach($scope.memorial.timeline.era,function(era,key){
          timeline_eras.push(era);
        });
      }

      timeline_data.timeline.date = timeline_dates;
      timeline_data.timeline.era = timeline_eras;

      angular.element('#timeline-embed').empty();

      createStoryJS({
           type:       'timeline',
           // width:      '100%',
           height:     '700',
           source:     timeline_data,
           embed_id:   'timeline-embed'
       });
    };

   $scope.uploadTimelineStory = function(){
      if(!angular.equals({}, $scope.storiesArray)){
        angular.forEach($scope.storiesArray, function(storiesKey, eraKey) {
          var eraStart = moment($scope.memorial.timeline.era[eraKey].startDate);
          var eraEnd = moment($scope.memorial.timeline.era[eraKey].endDate);
          var cntStories = storiesKey.length;
          var timeStep = (eraEnd - eraStart)/cntStories;
          var index = 0;

          angular.forEach(storiesKey, function(storyKey, key) {
            $scope.storiesObject[eraKey][storyKey].startDate = moment(eraStart + timeStep*index).format("YYYY-MM-DD");
            index++;

            if($scope.storiesObject[eraKey][storyKey].newStory){
              $scope.totalStoryCnt++;     
              // create story
              var copyStory = {};
              angular.copy($scope.storiesObject[eraKey][storyKey],copyStory);

              var file = {
                type: copyStory.file.type,
                location: 'local',
                url: '/tmp/' + copyStory.file.uniqueIdentifier,
                updated_at: moment().toString()
              }
              copyStory.file = file;
              
              // delete copyStory.newStory;
              Composite.createTimelineStory($scope.memorialKey,copyStory).then(function(value){
              }, function(error){
                console.log(error);
              });

            }
          });
        });
        $scope.isChanged = false;
        // waitStoryLoaded(true);
      }else{
        alert("재생 할 아이템이 없습니다.");
      }
    };
    
    $scope.flowFilesAdded = function($files){
      $scope.isChanged = true;
      angular.forEach($files, function(value, key) {
        value.type = value.file.type.split("/")[0];
      
        var startDate = moment(value.file.lastModifiedDate).format("YYYY-MM-DD");
        
        if($scope.storiesArray[$scope.selectedEraKey] == undefined) {
          $scope.storiesArray[$scope.selectedEraKey] = [];
          $scope.storiesObject[$scope.selectedEraKey] = {};
        };

        var tempKey = Util.getUniqueId();
        $scope.storiesArray[$scope.selectedEraKey].push(tempKey);
        $scope.storiesObject[$scope.selectedEraKey][tempKey] = 
          {
            type: 'timeline',
            file: value,
            newStory: true,
            tempKey: tempKey,

            ref_memorial: $scope.memorialKey,
            ref_era: $scope.selectedEraKey,
            ref_user: $scope.currentUser.uid,
            
            startDate: startDate,
            text: '내용없음',
            headline: '제목없음',
            asset: {
              "media": '/tmp/' + value.uniqueIdentifier,
              "thumbnail": (value.type=='image') ? '/tmp/' + value.uniqueIdentifier : 'assets/images/video_24.png',
            }
          };
      });
    };

    // $scope.flowFileDeleted = function(story){
    //   var index = $scope.stories.indexOf(story);

    //   // TODO: delete from remote server
    //   story.file.cancel();

    //   $scope.stories.splice(index, 1);  
    // };

    $scope.toggleEditMode = function(){
      $scope.editMode = !$scope.editMode;
    };

    $scope.testMessage = function(text) {
      console.log(text);
    }
    
    $scope.openModal = function (story) {
      var modalInstance = $modal.open({
        templateUrl: 'app/memorial/story/edit_modal.html',
        controller: 'ModalCtrl',
        size: 'lg',
        resolve: { 
          paramFromDialogName: function(){
            return 'story';
          },         
          paramFromDialogObject: function () {
            console.log(story);
            return story;
          }
        }
      });

      modalInstance.result.then(function (paramFromDialogObject) {
        //click ok
        // console.log('click ok');
        // $scope.paramFromDialogObject = paramFromDialogObject;
      }, function () {
        //canceled
      });
    };
  });

