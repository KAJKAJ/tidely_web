'use strict';

angular.module('doresolApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('main_invites', {
        url: '/invited/:memorialId/:inviterId',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('qna', {
        url: '/customercare',
        templateUrl: 'app/main/qna.html',
        controller: 'MainCtrl'
      })
      .state('agency', {
        url: '/agency',
        templateUrl: 'app/main/agency.html',
        controller: 'AgencyCtrl'
      });
  });