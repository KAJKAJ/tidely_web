'use strict';

describe('Controller: StorylineCtrl', function () {

  // load the controller's module
  beforeEach(module('doresolApp'));

  var StorylineCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StorylineCtrl = $controller('StorylineCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
