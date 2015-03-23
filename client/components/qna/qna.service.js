'use strict';

angular.module('doresolApp')
  .factory('Qna', function Story($firebase, $q, $timeout, ENV) {

  var ref = new Firebase(ENV.FIREBASE_URI + '/qna');
  var qna = $firebase(ref);
  
  var create = function(newQna) {
    newQna.created_at = moment().toString();
    newQna.updated_at = newQna.created_at;

    return qna.$push(newQna);
  }
  // var forever = moment("99991231235959999", "YYYYMMDDHHmmssSSS").unix();
      
  // var ref = new Firebase(ENV.FIREBASE_URI + '/qna');
  
  // var create = function(newQna) {
  //   newQna.created_at = moment().toString();
  //   newQna.updated_at = newQna.created_at;
  //   var now = moment().unix();

  //   return ref.setWithPriority(newQna,forever - now + Util.getSequence());
  // }

  return {
    create: create
  }

});
