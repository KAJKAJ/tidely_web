'use strict';

/**
 * Removes server error when user updates input
 */
angular.module('doresolApp')
  .directive('flowImage', function () {
    return {
      scope: false,
      require: '^flowInit',
      link: function(scope, element, attrs, ngModel) {
        var file = attrs.flowImage;
        
        // scope.$watch(file, function (file) {
        //   scope.$on('flow::fileSuccess', function (event, $flow, flowFile, message) {
        //     if(file == flowFile){
        //       if (!file) {
        //         return ;
        //       }
        //       var fileType = file.file.type.split('/');
        //       console.log(fileType);
        //       if(fileType[0] != 'image'){
        //         return ;
        //       }
        //       // scope.$apply(function () {
        //         attrs.$set('src', '/tmp/'+flowFile.uniqueIdentifier);
        //       // });
        //       // attrs.$set('src','/tmp/'+flowFile.uniqueIdentifier);
        //     }            
        //   });
        // });


        scope.$watch(file, function (file) {
          if (!file) {
            return ;
          }
          var fileType = file.file.type.split('/');

          if(fileType[0] != 'image'){
            return ;
          }

          if(!attrs.src){
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file.file);
            // fileReader.readAsDataURL(file.flowObj.files[0]);
            fileReader.onload = function (event) {
              scope.$apply(function () {
                attrs.$set('src', event.target.result);
              });
            };
          }
        });
      }
    };
  });

