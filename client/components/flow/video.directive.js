'use strict';

/**
 * Removes server error when user updates input
 */
angular.module('doresolApp')
  .directive('flowVideo', function () {
    return {
      scope: false,
      require: '^flowInit',
      link: function(scope, element, attrs, ngModel) {
        var file = attrs.flowVideo;
        scope.$watch(file, function (file) {
          if (!file) {
            return ;
          }
          var fileType = file.file.type.split('/');

          if(fileType[0] != 'video'){
            return ;
          }
          
          var fileReader = new FileReader();
          fileReader.readAsDataURL(file.file);
          fileReader.onload = function (event) {
            scope.$apply(function () {
              attrs.$set('src', event.target.result);
            });
          };
        });
      }
    };
  });

