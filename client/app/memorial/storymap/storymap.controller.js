'use strict';

angular.module('doresolApp')
  .controller('StorymapCtrl', function ($scope,$state,$stateParams,Memorial,ENV,$firebase,User,Composite,Comment,Util,Story,$timeout,$modal,ngDialog){

    if($stateParams.mode) {
      $scope.mode = $stateParams.mode;
    } else {
      $scope.mode = 'video';
    }

    $scope.currentUser = User.getCurrentUser();
    $scope.isChanged = false;

    $scope.memorialKey = $stateParams.id;
    $scope.memorial = Memorial.getCurrentMemorial();

    // for setting
    $scope.storiesArray = [];
    $scope.storiesArray['timeline'] = [];
    $scope.storiesArray['storymap'] = [];

    $scope.storiesObject = {};
    $scope.storiesObject['timeline'] = {};
    $scope.storiesObject['storymap'] = {};
    $scope.galleryObject = {};

    $scope.modes = {
      'setting': { label: '사진 올리기', icon: 'fa-cog'},
      'video': { label: '슬라이드 쇼', icon: 'fa-play-circle-o'},
      'timeline': { label: '시간으로 보기', icon: 'fa-clock-o'},
      'storymap': { label: '장소로 보기', icon: 'fa-map-marker'},
      'gallery': { label: '사진 갤러리', icon: 'fa-picture-o'},
    };

    $scope.isMemorialLoaded = false;

    $scope.memorial.$loaded().then(function(value){

      $scope.isOwner = Memorial.isOwner();
      $scope.isMember = Memorial.isMember();
      $scope.isGuest = Memorial.isGuest();
      
      angular.forEach(value.stories, function(story, key) {
        story.$id = key;
        $scope.assignStory(story);
      });

      switch($scope.mode) {
        case 'timeline':
          $scope.createTimeline();
          break;
        case 'storymap':
          $scope.createStorymap();
          break;
        case 'video':
          // console.log(value);
          if(value.stories) {
            $timeout(function(){
              $scope.createVideo();
            });
          }
          break;
        default:
          break;
      };

      $scope.isMemorialLoaded = true;

    });

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

    $scope.isSelected = function(mode) {
      return $scope.mode == mode;
    };

    $scope.changeMode = function(mode){
      switch(mode) {
        case 'setting':
          break;
        case 'gallery':
          $timeout(function(){
            $scope.changeToGalleryMode();
          });
          break;
        case 'timeline':
          $timeout(function(){
            $scope.createTimeline();
          });
          break;
        case 'storymap':
          $timeout(function(){
            $scope.createStorymap();
          });
          break;
        case 'video':
          if($scope.storiesArray['timeline'].length > 0){
            $timeout(function(){
              $scope.createVideo();
            });
          }
        default:
          break;
      }
      $scope.mode = mode;
    }

    $scope.play = function() {
      $scope.isShowing = true;
      TweenMax.resumeAll();
    }

    $scope.pause = function() {
      $scope.isShowing = false;
      TweenMax.pauseAll();
    }

    $scope.createVideo = function() {
      $scope.isShowing = true;
      var totLen = $scope.storiesArray['timeline'].length;
      $scope.videoPlaying = true;
      $scope.slides = [];

      function makeSlideItems(storyKey, blurItemCnt, index) {
        var retSlideItems = [];
        for (var i=1; i<blurItemCnt; i++) {
          var blurIndex = index + i;
          if(totLen <= blurIndex) {
            blurIndex = blurIndex - totLen;
          }
          var blurStoryKey = $scope.storiesArray['timeline'][blurIndex];
          retSlideItems.push( {class: 'blur' + i, src: $scope.storiesObject['timeline'][blurStoryKey].file.url});
        }

        var classAdditional = (index%2 ==0)? "rotate_left": "rotate_right";
        retSlideItems.push( {main: true, class: 'item ' + classAdditional , src: $scope.storiesObject['timeline'][storyKey].file.url});

        return retSlideItems;
      }

      angular.forEach($scope.storiesArray['timeline'], function(storyKey, index){

        var blurItemCnt =0;
        var slideItems = [];
        blurItemCnt = (totLen > 5)? 5: totLen;
        
        slideItems = makeSlideItems(storyKey, blurItemCnt, index);
        $scope.slides.push(slideItems);
      });

      $scope.$digest();

      var $slides = $(".slideshow");
      var currentSlide = 0;
      var stayTime = 3;
      var slideTime = 3;

      var rotation = 5;
      var prevSlide = 0;

      // var tween = new TweenMax();

      // TweenLite.set($slides.filter(":gt(0)", 0, {autoAlpha:0}));
      TweenMax.set($slides, {autoAlpha:0});
      TweenMax.set($slides[0], {autoAlpha:1});

      // fade in first slide
      // console.log(currentSlide);
      TweenMax.to($slides[currentSlide], 3, {rotation: rotation, scale: 1.1});
      TweenMax.to($slides[currentSlide], 3, {autoAlpha:1});  

      TweenMax.delayedCall(4, nextSlide); //wait a couple of seconds before next slide

      function nextSlide() {
        rotation = (currentSlide % 2 == 0)? 5: -5;
        prevSlide = currentSlide;

        TweenMax.to($slides[prevSlide], 2, {autoAlpha:0});   //fade out current slide4
        currentSlide = ++currentSlide % $slides.length;             //find out the next slide

        TweenMax.to($slides[currentSlide], 3, {rotation: -rotation, scale: 1.1});
        TweenMax.to($slides[currentSlide], 3, {autoAlpha:1});   //fade in the next slide
        // TweenMax.to($slides[prevSlide], 1, {rotation: -rotation});   //fade out current slide

        if($scope.mode === 'video'){
          if(currentSlide != ($slides.length - 1)) {
            TweenMax.delayedCall(4, nextSlide); //wait a couple of seconds before next slide

          } else {
            $timeout(function(){
              $scope.changeMode('gallery');
              $scope.$digest();
            },4500);
          }
        }
      }
    }

    $scope.changeToGalleryMode = function(){
      angular.copy($scope.storiesObject['timeline'],$scope.galleryObject);
      // $scope.changeGalleryImageSize();
      $scope.videoPlaying = false;
    }

    // $scope.changeGalleryImageSize = function(){
    //   angular.forEach($scope.galleryObject,function(value,key){
    //     var randomValue = Util.getRandomInt(1,10);
    //     if(randomValue < 2){
    //       $scope.galleryObject[key].col = "col-md-2";
    //     }else if(randomValue < 5){
    //       $scope.galleryObject[key].col = "col-md-3";
    //     }else if(randomValue < 8){
    //       $scope.galleryObject[key].col = "col-md-4";
    //     }else{
    //       $scope.galleryObject[key].col = "col-md-6";
    //     }
    //   });
    // }

    $scope.openImageModal = function(story){
      var modalInstance = $modal.open({
        templateUrl: 'app/memorial/storymap/image_modal.html',
        controller: 'ModalCtrl',
        size: 'lg',
        resolve: { 
          paramFromDialogName: function(){
            return 'story';
          },         
          paramFromDialogObject: function () {
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
    }

    var currentStoriesRef =  new Firebase(ENV.FIREBASE_URI + '/memorials/'+$scope.memorialKey+'/stories');
    var _stories = $firebase(currentStoriesRef).$asArray();

    _stories.$watch(function(event){
      switch(event.event){
        case "child_removed":

          var storyId = event.key;

          // delete from timeline and setting
          var index = $scope.storiesArray['timeline'].indexOf(event.key);
          if( index >= 0) {
            $scope.storiesArray['timeline'].splice(index, 1);
            delete $scope.storiesObject['timeline'][storyId];
          }

          // delete from storymap
          index = $scope.storiesArray['storymap'].indexOf(storyId);
          if( index >= 0) {
            $scope.storiesArray['storymap'].splice(index, 1);
            delete $scope.storiesObject['storymap'][storyId];
          }

          break;
        case "child_added":

          // if($scope.isMemorialLoaded == false || $scope.storiesArray['timeline'].indexOf(event.key) >= 0) break;

          // var childRef = currentStoriesRef.child(event.key);
          // var child = $firebase(childRef).$asObject();

          // child.$loaded().then(function(value){

          //   if(value.newStory) {
          //     var index = $scope.storiesArray['timeline'].indexOf(value.tempKey);
          //     if(index >=0 ) {
          //       $scope.storiesArray['timeline'].splice(index, 1);
          //       delete $scope.storiesObject['timeline'][value.tempKey];
          //     }
              
          //     // change newStory to false
          //     child.newStory = false;
          //     $scope.assignStory(child);
          //     child.$save().then(function(newValue){
          //     });

          //   } else {
          //     $scope.assignStory(value);
          //   }

          // });

        break;
      }
    });

    $scope.assignStory = function(value) {

      $scope.storiesArray['timeline'].push(value.$id);
      $scope.storiesObject['timeline'][value.$id] = value;
      
      $scope.storiesArray['timeline'].sort(function(aKey,bKey){
        var aValue = $scope.storiesObject['timeline'][aKey];
        var bValue = $scope.storiesObject['timeline'][bKey];
        var aStartDate = moment(aValue.startDate).unix();
        var bStartDate = moment(bValue.startDate).unix();
        return aStartDate > bStartDate ? 1 : -1;
      });

      if(value.location){
        if(value.location.name != ''){
          $scope.storiesArray['storymap'].push(value.$id);
          $scope.storiesObject['storymap'][value.$id] = value;  

          $scope.storiesArray['storymap'].sort(function(aKey,bKey){
            var aValue = $scope.storiesObject['storymap'][aKey];
            var bValue = $scope.storiesObject['storymap'][bKey];
            var aStartDate = moment(aValue.startDate).unix();
            var bStartDate = moment(bValue.startDate).unix();
            return aStartDate > bStartDate ? 1 : -1;
          });
        }
      }
    }
    
    $scope.makeTimelineCredit = function(){
      return 'By ' + $scope.currentUser.profile.name;
    }

    // Update Story 
    $scope.saveStory = function(storyKey) {
      if(!$scope.storiesObject['timeline'][storyKey].newStory) {
        delete $scope.storiesObject['timeline'][storyKey].$id;
        var _story = $firebase(currentStoriesRef);
        $scope.storiesObject['timeline'][storyKey].media.credit = $scope.makeTimelineCredit();

        _story.$update(storyKey, $scope.storiesObject['timeline'][storyKey]).then(function(value) {
          if($scope.storiesObject['timeline'][storyKey].location) {
            $scope.storiesObject['storymap'][storyKey] = $scope.storiesObject['timeline'][storyKey];
            $scope.storiesArray['storymap'].push(storyKey);
          }else{
            delete $scope.storiesObject['storymap'][storyKey];
            var index = $scope.storiesArray['storymap'].indexOf(storyKey);
            if( index >= 0) {
              $scope.storiesArray['storymap'].splice(index, 1);
              delete $scope.storiesObject['storymap'][storyKey];
            }
          }
          $scope.saveMessage = '저장되었습니다.';
          $timeout(function(){
            $scope.saveMessage = '';
          },2000);
        });
      }
    }

    
    $scope.getFlowFileUniqueId = function(file){
      return $scope.currentUser.uid.replace(/[^\.0-9a-zA-Z_-]/img, '') + '-' + Util.getFlowFileUniqueId(file,$scope.currentUser);
    };
    
    $scope.removeSelectedStory = function(storyId) {

      var _story = $firebase(currentStoriesRef);

      // delete from timeline and setting
      var index = $scope.storiesArray['timeline'].indexOf(storyId);
      $scope.storiesArray['timeline'].splice(index, 1);
      if(!$scope.storiesObject['timeline'][storyId].newStory){
        // TODO: 바껴야 됨
        _story.$remove(storyId).then(function() {
        });
      }
      delete $scope.storiesObject['timeline'][storyId];

      // delete from storymap
      var index = $scope.storiesArray['storymap'].indexOf(storyId);
      if( index >= 0) {
        $scope.storiesArray['storymap'].splice(index, 1);
        delete $scope.storiesObject['storymap'][storyId];
      }
    };

    $scope.createTimeline = function(){

      if($scope.storiesArray['timeline'].length ==0) return;

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
      angular.forEach($scope.storiesArray['timeline'],function(storyKey,index){
        // console.log($scope.storiesObject['timeline'][storyKey]);
        var comments = "<span class='pull-left'><comments story-key='"+ storyKey + "' memorial-key='" + $scope.memorialKey + "'></comments></span>" ;
        var copyStory = {
          $id:storyKey,
          file:$scope.storiesObject['timeline'][storyKey].file,
          ref_memorial:$scope.storiesObject['timeline'][storyKey].ref_memorial,
          ref_user:$scope.storiesObject['timeline'][storyKey].ref_user,
          startDate:$scope.storiesObject['timeline'][storyKey].startDate,
          text:$scope.storiesObject['timeline'][storyKey].text.text,
          headline:$scope.storiesObject['timeline'][storyKey].text.headline,
          videoUrl: $scope.storiesObject['timeline'][storyKey].text.videoUrl,
          asset:{
            media:$scope.storiesObject['timeline'][storyKey].media.url,
            thumbnail:$scope.storiesObject['timeline'][storyKey].media.url,
            credit: comments + $scope.storiesObject['timeline'][storyKey].media.credit ,
            caption:$scope.storiesObject['timeline'][storyKey].media.caption
          }
        }
        // console.log(copyStory);
        timeline_dates.push(copyStory);
      });
      
      timeline_data.timeline.date = timeline_dates;
      angular.element('#timeline-embed').empty();

      createStoryJS({
           type:       'timeline',
           // width:      '100%',
           height:     '700',
           source:     timeline_data,
           embed_id:   'timeline-embed'
       });

    };

    $scope.createStorymap = function(){

      if ($scope.storiesArray['storymap'].length == 0) return;

      // certain settings must be passed within a separate options object
      var storymap_options = {
        // width: 500,                // required for embed tool; width of StoryMap                    
        // height: 800,               // required for embed tool; width of StoryMap
        storymap: {
            language: "KR",          // required; two-letter ISO language code
            map_type: "stamen:toner-lines",          // required
            map_as_image: false,       // required
        }
      }
      
      var storymap_data = {
        storymap:{
          slides:[]
        }
      };

      // Storymap Overview
      storymap_data.storymap.slides.push(
        {
            type: "overview",
            text: {
               headline: $scope.memorial.name + "<small>지나온 발자취..</small>",
               text: ""
            },
            media: {
              url:   $scope.memorial.file.url,
              caption: "Overview"
            },
            story:null
        }
      );

      angular.forEach($scope.storiesArray['storymap'],function(storyKey){
        
        // add comment directive for credit
        var comments = "<span class='pull-left'><comments story-key='"+ storyKey + "' memorial-key='" + $scope.memorialKey + "'></comments></span>" ;
        var tmpCredit = comments + $scope.storiesObject['storymap'][storyKey].media.credit;
        var mediaMeta = {
          ref_memorial:$scope.storiesObject['storymap'][storyKey].ref_memorial,
          ref_user:$scope.storiesObject['storymap'][storyKey].ref_user,
          storyKey:storyKey
        }

        var media = {};
        angular.copy($scope.storiesObject['storymap'][storyKey].media, media);

        var copyStory = {
          // $id: $scope.storiesObject['storymap'][storyKey].$id,
          text:$scope.storiesObject['storymap'][storyKey].text,
          location:$scope.storiesObject['storymap'][storyKey].location,
          media:media,
          story:$scope.storiesObject['storymap'][storyKey],
        };
        copyStory.media.meta = mediaMeta;
        if(copyStory.location.caption){
          copyStory.media.caption = copyStory.location.caption;
        }
        copyStory.media.credit = tmpCredit;
        // console.log(copyStory);
        storymap_data.storymap.slides.push(copyStory);
        
      });
  
      angular.element('#mapdiv').empty();

      var storymap = new VCO.StoryMap('mapdiv', storymap_data, storymap_options);
      
      window.onresize = function(event) {
        storymap.updateDisplay(); // this isn't automatic
      }
      
    };

   $scope.uploadStory = function(){
      if($scope.storiesArray['timeline'].length > 0){
        var memorialStart = moment($scope.memorial.dateOfBirth);
        var memorialEnd = moment($scope.memorial.dateOfDeath);
        var cntStories = $scope.storiesArray['timeline'].length;
        var timeStep = (memorialEnd - memorialStart)/cntStories;
        var index = 0;

        angular.forEach($scope.storiesArray['timeline'], function(storyKey,index) {
          var oldStartDate = $scope.storiesObject['timeline'][storyKey].startDate;
          $scope.storiesObject['timeline'][storyKey].startDate = moment(memorialStart + timeStep*index).format("YYYY-MM-DD");
          // index++;
          if($scope.storiesObject['timeline'][storyKey].newStory){
            // create story
            var copyStory = {};
            angular.copy($scope.storiesObject['timeline'][storyKey],copyStory);

            var file = {
              type: copyStory.file.type,
              location: 'local',
              url: '/tmp/' + copyStory.file.uniqueIdentifier,
              updated_at: moment().toString()
            }

            if(Util.objectSize(copyStory.location) == 0)  {
              copyStory.location = {
                name: '',
                lat: '',
                lon: ''
              };
            } else {
              copyStory.media.caption = $scope.storiesObject['timeline'][storyKey].location.name;
            }

            copyStory.file = file;
            copyStory.newStory = false;
            copyStory.media.credit = $scope.makeTimelineCredit();

            console.log(copyStory);

            Composite.createStory($scope.memorialKey,copyStory).then(function(value){
              var index = $scope.storiesArray['timeline'].indexOf(storyKey);
              if(index >=0 ) {
                $scope.storiesArray['timeline'].splice(index, 1);
                delete $scope.storiesObject['timeline'][storyKey];
              }
              copyStory.$id = value.key;

              $scope.assignStory(copyStory);
              
              }, function(error){
                console.log(error);
            });

          }else{
            if(oldStartDate != $scope.storiesObject['timeline'][storyKey].startDate){
              delete $scope.storiesObject['timeline'][storyKey].$id;
              $scope.storiesObject['timeline'][storyKey].media.credit = $scope.makeTimelineCredit();

              Story.update(storyKey,$scope.storiesObject['timeline'][storyKey]);
            }
          }
          
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
      
        var tempKey = Util.getUniqueId();
        $scope.storiesArray['timeline'].push(tempKey);
        $scope.storiesObject['timeline'][tempKey] = 
          {
            file: value,
            newStory: true,
            tempKey: tempKey,

            ref_memorial: $scope.memorialKey,
            ref_user: $scope.currentUser.uid,
            
            text: {
              headline:'',
              text:''
            },
            media:{
              url: '/tmp/' + value.uniqueIdentifier,
              credit: '',
              caption: ''
            },
            location:{
              
            }
          };
      });
    };
  });
