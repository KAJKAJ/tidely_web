'use strict';

angular.module('doresolApp')
	.animation('.fade-in-animation', function ($window) {
    return {
			enter: function (element, done) {
        TweenMax.fromTo(element, 1, { opacity: 0}, {opacity: 1, onComplete: done});
      },

      leave: function (element, done) {
        TweenMax.to(element, 1, {opacity: 0, onComplete: done});
      }
    };
})
.animation('.slide-left-animation', function ($window) {
    return {
        enter: function (element, done) {
            TweenMax.fromTo(element, 1, { left: $window.innerWidth}, {left: 0, onComplete: done});
        },

        leave: function (element, done) {
            TweenMax.to(element, 1, {left: -$window.innerWidth, onComplete: done});
        }
    };
})
.animation('.slide-down-animation', function ($window) {
    return {
        enter: function (element, done) {
            TweenMax.fromTo(element, 1, { top: -$window.innerHeight}, {top: 0, onComplete: done});
        },

        leave: function (element, done) {
            TweenMax.to(element, 1, {top: $window.innerHeight, onComplete: done});
        }
    };
});

