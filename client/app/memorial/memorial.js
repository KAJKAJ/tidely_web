'use strict';

angular.module('doresolApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('memorial', {
        // abstract: true,
        url: '/memorial/:id',
        templateUrl: 'app/memorial/memorial.html',
        controller: 'MemorialCtrl',
        // onEnter: function(){
        //   console.log('enter main');
        // },
        // onExit: function(){
        //   console.log('exit main');
        // },
        // authenticate: true
      })

      .state('memorial.profile', {
        url:'/profile',
        templateUrl: 'app/memorial/profile/profile.html',
        controller: 'ProfileCtrl',
        authenticate: true
      })
      .state('memorial.timeline', {
        url:'/timeline',
        templateUrl: 'app/memorial/timeline/timeline.html',
        controller: 'TimelineCtrl',
        authenticate: true
      })      
      .state('memorial.storyline', {
        url:'/letter',
        templateUrl: 'app/memorial/storyline/storyline.html',
        controller: 'StorylineCtrl',
        authenticate: true
      })
      .state('memorial.storymap', {
        url:'/story/:mode',
        templateUrl: 'app/memorial/storymap/storymap.html',
        controller: 'StorymapCtrl',
        authenticate: true
      })
      .state('memorial.member', {
        url:'/member',
        templateUrl: 'app/memorial/member/member.html',
        controller: 'MemberCtrl',
        authenticate: true
      })
      .state('memorial_create', {
        templateUrl: 'app/memorial/create/create.html',
        // controller: 'MemorialCreateCtrl',
        authenticate: true
      });
  });

