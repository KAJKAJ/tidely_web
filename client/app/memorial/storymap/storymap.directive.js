'use strict';

angular.module('doresolApp')
  .directive('bgImage', function ($window, $timeout) {
    return function (scope, element, attrs) {
        var resizeBG = function () {
            var bgwidth = element.width();
            var bgheight = element.height();

            var winwidth = $window.innerWidth;
            var winheight = $window.innerHeight;

            var widthratio = winwidth / bgwidth;
            var heightratio = winheight / bgheight;

            var widthdiff = heightratio * bgwidth;
            var heightdiff = widthratio * bgheight;

            if (heightdiff > winheight) {
                element.css({
                    width: winwidth - 200 + 'px',
                    height: heightdiff - 200 + 'px'
                });
            } else {
                element.css({
                    width: widthdiff - 200 + 'px',
                    height: winheight - 200 + 'px'
                });
            }
        };

        var windowElement = angular.element($window);
        windowElement.resize(resizeBG);

        element.bind('load', function () {
            resizeBG();
        });
    }
})
.directive('storymapApi',function(){
    return {
      restrict: 'E',
      scope:{
        story: '='
      },
      templateUrl: "app/memorial/storymap/storymap_api.html",
      controller: function($scope){
        $scope.mapDetails = {};
        if($scope.story.location){
          $scope.autocomplete = $scope.story.location.caption;
        }

        var default_lat = 35.907757;
        var default_lon = 127.76692200000002 ;
        if($scope.story.location){
          if($scope.story.location.lat){
            default_lat = $scope.story.location.lat;
          }
          if($scope.story.location.lon){
            default_lon = $scope.story.location.lon;
          }
        }
        $scope.map = {
          center: {
              latitude: default_lat ,
              longitude: default_lon  
          },
          zoom: $scope.story.location ? 15 : 7
        };

        $scope.marker = {
          id:0,
          coords: {
              latitude: default_lat ,
              longitude: default_lon  
          },
          options: { draggable: false }
        }

        $scope.$watch('autocomplete',function(value){
          if(!value){
             $scope.story.location = null;
          }
        });

        $scope.$watch('mapSearchDetails',function(value){
          if(value){
            
            var lon = value.geometry.location.D;
            var lat = value.geometry.location.k;
            
            $scope.map.center.latitude = lat;
            $scope.map.center.longitude = lon;

            //marker
            $scope.marker.coords.latitude = lat;
            $scope.marker.coords.longitude = lon;

            $scope.story.location = {
              lat: lat,
              lon: lon,
              caption: value.formatted_address
            }
            // $scope.story.location.name = $scope.autocomplete;
          }
        });
      }
    }
  })
  .directive('slideshowMainImage', function () {
    return {
      restrict: 'A',
      scope: false,
      link: function(scope, element, attrs, ngModel) {
        element.bind("load" , function(event){ 
            // success, "load" event catched
            // now we can do specific stuff:
            // console.log(element);
            var width = element[0].width;
            var height = element[0].height;
            // console.log(width);
            // console.log(height);
            element.removeClass('item');
            if(width >= height){
              element.addClass('item-horizontal');
            }else{
              element.addClass('item-vertical');
            }
            // $compile(element)(scope);
        });

      }
    };
  })
;