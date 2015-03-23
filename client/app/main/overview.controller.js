'use strict';

angular.module('doresolApp')
  .controller('overviewCtrl', function ($scope, $modal, $http, ENV, $firebase, Memorial,Util, ngDialog) {

  $scope.isMobile = Util.isMobile();

  $scope.storiesArray = [];
  $scope.storiesArray['timeline'] = [];
  $scope.storiesArray['storymap'] = [];
  
  $scope.storiesObject = {};
  $scope.storiesObject['timeline'] = {};
  $scope.storiesObject['storymap'] = {};

  $scope.memorialKey = null;

  //assume first memorial is a sample
  var memorialsRef =  new Firebase(ENV.FIREBASE_URI + '/memorials/');
  var sampleMemorial = memorialsRef.startAt().limit(1);

  sampleMemorial.on('child_added', function(value) { 
    $scope.memorialKey = value.name();
    Memorial.setCurrentMemorial($scope.memorialKey);
    $scope.memorial = Memorial.getCurrentMemorial();
    $scope.memorial.$loaded().then(function(memorialValue){
      angular.forEach(memorialValue.stories, function(story, key) {
        story.$id = key;
        $scope.assignStory(story);
      });
    });
  });

  $scope.openInterviewModal = function(){
    ngDialog.openConfirm({ 
      template: '/app/main/overview_interview.html',
      // controller: 'MainCtrl',
      className: 'ngdialog-theme-large',
      // scope: event.targetScope
    }).then(function (value) {
      // console.log('Modal promise resolved. Value: ', value);
    }, function(reason) {
      // console.log('Modal promise rejected. Reason: ', reason);
    });
  }

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

  $scope.openOverviewModal = function(mode){
   var modalInstance = $modal.open({
      templateUrl: 'app/main/overview_modal_slideshow.html',
      controller: 'overviewModalCtrl',
      size: 'lg',
      windowClass:'overveiw-modal',
      resolve: { 
        paramFromDialogName: function(){
          return 'parent';
        },         
        paramFromDialogObject: function () {
          return {
            storiesObject:$scope.storiesObject,
            storiesArray:$scope.storiesArray,
            mode:mode,
            memorial:$scope.memorial
          }
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
}).controller('overviewModalCtrl', function ($scope, $modalInstance, paramFromDialogName, paramFromDialogObject, $timeout) {
  $scope[paramFromDialogName] = paramFromDialogObject;
  $scope.storiesObject = $scope.parent.storiesObject;
  $scope.storiesArray = $scope.parent.storiesArray;
  $scope.mode = $scope.parent.mode;
  $scope.memorial = $scope.parent.memorial;

  $scope.createVideo = function(){
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

      if(currentSlide != ($slides.length - 1)) {
        TweenMax.delayedCall(4, nextSlide); //wait a couple of seconds before next slide

      } else {
        $timeout(function(){
          $scope.createVideo();
        });
      }
    }
  }

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
        }
      }
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

  }

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
          }
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
    
  }

  switch($scope.mode){
    case 'interview':
      break;
    case 'video':
      $timeout(function(){
        $scope.createVideo();
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
  }
  
  $scope.ok = function () {
    $modalInstance.close($scope[paramFromDialogName]);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
