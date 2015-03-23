'use strict';

angular.module('doresolApp')
  .factory('File', function File($firebase, $q, ENV) {
    var localFilesRef = new Firebase(ENV.FIREBASE_URI + '/local_files');
		var localFiles = $firebase(localFilesRef).$asArray();

    var createLocalFile = function(params) {
	  	return localFiles.$add({
	  		fileParentPath: params.fileParentPath,
				fileUrl: params.fileUrl
	  	}).then( function(ref) {
      	return params;
			});
    };

    return {
    	createLocalFile: createLocalFile
    }

  });

