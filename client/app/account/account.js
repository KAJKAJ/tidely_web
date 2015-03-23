'use strict';

angular.module('doresolApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginCtrl'
      })
      .state('login.invites', {
        url: '/:memorialId/:inviterId',
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupCtrl'
      })
      .state('signup.invites', {
        url: '/:memorialId/:inviterId',
      })
      .state('request', {
        url: '/request/:memorialId/:requesterId',
        templateUrl: 'app/account/request/request.html',
        controller: 'RequestCtrl',
        authenticate: true
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'app/account/settings/settings.html',
        // controller: 'SettingsCtrl',
        authenticate: true
      })
      .state('invites', {
        url: '/invites/:memorialId/:inviterId',
        templateUrl: 'app/account/invites/invites.html',
        controller: 'InvitesCtrl'
      });
  });